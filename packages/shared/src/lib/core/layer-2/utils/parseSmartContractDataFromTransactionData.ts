import { StardustActivityType } from '@core/activity'
import { IEvmNetwork, isIscNetwork } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { AbiDecoder, Converter, HEX_PREFIX } from '@core/utils'
import { isTrackedNftAddress, isTrackedTokenAddress } from '@core/wallet/actions'
import { ERC20_ABI, ERC721_ABI, ISC_SANDBOX_ABI } from '../abis'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import {
    Erc20TransferMethodInputs,
    Erc721SafeTransferMethodInputs,
    IscCallMethodInputs,
    IscSendMethodInputs,
} from '../interfaces'
import { BigIntLike, BytesLike } from '@ethereumjs/util'
import { lookupMethodSignature } from './lookupMethodSignature'

type ParsedSmartContractData = IParsedCoinTransfer | IParsedTokenTransfer | IParsedNftTransfer | IParsedSmartContractData

enum ParsedSmartContractType {
    CoinTransfer,
    TokenTransfer,
    NftTransfer,
    SmartContract
}

interface IParsedCoinTransfer  {
    type: ParsedSmartContractType.CoinTransfer
    rawAmount: bigint
    recipientAddress: string
}

interface IParsedTokenTransfer extends IParsedSmartContractData {
    type: ParsedSmartContractType.TokenTransfer
    tokenId: string
    rawAmount: bigint
}

interface IParsedNftTransfer extends IParsedSmartContractData {
    type: ParsedSmartContractType.NftTransfer
    nftId: string
}

interface IParsedSmartContractData {
    type: ParsedSmartContractType
    rawMethod: string
    parsedMethod?: IParsedMethod,
    recipientAddress: string
}

interface IParsedMethod {
    name: string
    inputs: IParsedInput[]
}

interface IParsedInput {
    name: string,
    type: string,
    value: unknown,
}

export function parseSmartContractDataFromTransactionData(
    transaction: { to?: string; data?: BytesLike; value?: BigIntLike },
    evmNetwork: IEvmNetwork
): ParsedSmartContractData | undefined {
    const recipientAddress = transaction?.to?.toLowerCase()
    if (!recipientAddress) {
        return undefined
    }

    if (transaction.data) {
        const isErc20 = isTrackedTokenAddress(evmNetwork.id, recipientAddress)
        const isErc721 = isTrackedNftAddress(evmNetwork.id, recipientAddress)
        const isIscContract = recipientAddress === ISC_MAGIC_CONTRACT_ADDRESS

        let parsedData
        if (isErc20) {
            parsedData = parseSmartContractDataWithErc20Abi(evmNetwork, transaction.data, recipientAddress)
        } else if (isErc721) {
            parsedData = parseSmartContractDataWithErc721Abi(evmNetwork, transaction.data, recipientAddress)
        } else if (isIscContract) {
            parsedData = parseSmartContractDataWithIscMagicAbi(evmNetwork, transaction.data, recipientAddress)
        }

        return parsedData ?? parseSmartContractDataWithMethodRegistry(transaction.data as string, recipientAddress)
    } else {
        return {
            type: ParsedSmartContractType.CoinTransfer,
            rawAmount: Converter.bigIntLikeToBigInt(transaction.value ?? 0),
            recipientAddress,
        }
    }
}

function parseSmartContractDataWithIscMagicAbi(
    network: IEvmNetwork,
    data: BytesLike,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const iscMagicDecoder = new AbiDecoder(ISC_SANDBOX_ABI, network.provider)
    const decodedData = iscMagicDecoder.decodeData(data as string) // TODO: Type this return

    if (!decodedData) {
        return undefined
    }

    switch (decodedData.name) {
        case 'call': {
            if (!isIscNetwork(network)) {
                return undefined
            }

            const inputs = decodedData.inputs as IscCallMethodInputs
            const nativeToken = inputs?.allowance?.nativeTokens?.[0]
            const nftId = inputs?.allowance?.nfts?.[0]
            const agentId = inputs?.params.items?.find((item) => item.key === '0x61')?.value

            if (nativeToken) {
                const rawAmount =
                    nativeToken.ID.data === BASE_TOKEN_ID
                        ? network.denormaliseAmount(nativeToken.amount)
                        : BigInt(nativeToken.amount)
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    tokenId: nativeToken.ID.data,
                    rawAmount,
                    recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                }
            } else if (nftId) {
                return {
                    type: ParsedSmartContractType.NftTransfer,
                    nftId,
                    recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                }
            } else {
                return { type: ParsedSmartContractType.SmartContract, recipientAddress }
            }
        }
        case 'send': {
            if (!isIscNetwork(network)) {
                return undefined
            }

            const inputs = decodedData.inputs as IscSendMethodInputs
            const nativeToken = inputs?.assets?.nativeTokens?.[0]
            const nftId = inputs?.assets?.nfts?.[0]
            const baseTokenAmount = BigInt(inputs.assets.baseTokens)

            if (nativeToken) {
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    tokenId: nativeToken.ID.data,
                    rawAmount: BigInt(nativeToken.amount),
                    additionalBaseTokenAmount: baseTokenAmount,
                    recipientAddress, // for now, set it to the magic contract address
                }
            }
            if (nftId) {
                return {
                    type: ParsedSmartContractType.NftTransfer,
                    nftId,
                    additionalBaseTokenAmount: baseTokenAmount,
                    recipientAddress, // for now, set it to the magic contract address
                }
            } else if (baseTokenAmount) {
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    tokenId: BASE_TOKEN_ID,
                    rawAmount: network.denormaliseAmount(baseTokenAmount),
                    recipientAddress, // for now, set it to the magic contract address
                }
            }

            return { type: ParsedSmartContractType.SmartContract, recipientAddress }
        }
        default:
            return { type: ParsedSmartContractType.SmartContract, recipientAddress }
    }
}

function parseSmartContractDataWithErc20Abi(
    network: IEvmNetwork,
    data: BytesLike,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const erc20Decoder = new AbiDecoder(ERC20_ABI, network.provider)
    const decodedData = erc20Decoder.decodeData(data as string) // TODO: Type this return

    if (!decodedData) {
        return undefined
    }

    switch (decodedData.name) {
        case 'transfer': {
            const inputs = decodedData.inputs as Erc20TransferMethodInputs

            return {
                type: StardustActivityType.Basic,
                tokenId: recipientAddress,
                rawAmount: BigInt(inputs._value),
                recipientAddress: inputs._to,
            }
        }
        // TODO: Support more ERC20 methods
        default: {
            // TODO we know the method name and the parameters so we can add that here
            return {
                type: StardustActivityType.SmartContract,
                recipientAddress,
            }
        }
    }
}

function parseSmartContractDataWithErc721Abi(
    network: IEvmNetwork,
    data: BytesLike,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const erc721Decoder = new AbiDecoder(ERC721_ABI, network.provider)
    const decodedData = erc721Decoder.decodeData(data as string) // TODO: Type this return

    if (!decodedData) {
        return undefined
    }

    switch (decodedData.name) {
        case 'safeTransferFrom': {
            // Enum?
            const inputs = decodedData.inputs as Erc721SafeTransferMethodInputs

            return {
                type: StardustActivityType.Nft,
                nftId: `${recipientAddress}:${inputs.tokenId}`,
                recipientAddress: inputs.to,
            }
        }

        transferFrom(to:string, amount:bigint)

        // TODO: support more ERC721 methods
        default: {
            // TODO we know the method name and the parameters so we can add that here
            return {
                type: StardustActivityType.SmartContract,
                recipientAddress,
                method: {
                    name: decodedData.name,
                    inputs: decodedData.inputs
                }
            }
        }
    }
}

function parseSmartContractDataWithMethodRegistry(rawData: string, recipientAddress: string):  ParsedSmartContractData | undefined {
    const fourBytePrefix = rawData.substring(0, 10)
    try {
        const result = lookupMethodSignature(fourBytePrefix)
        if (!result) {
            throw Error('Method could not be found!')
        }

        const matches = /(\w+)\((.*)\)$/.exec(result)
        if (!matches) {
            throw Error('Method signature could not be parsed!')
        }

        const name = matches[1]
        const parametersArr = matches[2] ?? ''

        const parameters: Record<string, string> = parametersArr.split(',').reduce(
            (acc, type, index) => {
                acc[`param${index}`] = type
                return acc
            },
            {} as Record<string, string>
        )

        return { type: StardustActivityType.SmartContract, recipientAddress, method: {name, inputs: parameters} }
    } catch (error) {
        return undefined
    }
}
