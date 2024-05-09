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
    IParsedMethod,
} from '../interfaces'
import { BigIntLike, BytesLike } from '@ethereumjs/util'
import { lookupMethodSignature } from './lookupMethodSignature'
import { ParsedSmartContractData } from '../types/parsed-smart-contract-data.type'
import { ParsedSmartContractType } from '../enums'

export function parseSmartContractDataFromTransactionData(
    transaction: { to?: string; data?: BytesLike; value?: BigIntLike },
    evmNetwork: IEvmNetwork
): ParsedSmartContractData | undefined {
    const recipientAddress = transaction?.to?.toLowerCase()
    if (!recipientAddress) {
        return undefined
    }

    if (transaction.data) {
        const rawData = transaction.data as string
        const isErc20 = isTrackedTokenAddress(evmNetwork.id, recipientAddress)
        const isErc721 = isTrackedNftAddress(evmNetwork.id, recipientAddress)
        const isIscContract = recipientAddress === ISC_MAGIC_CONTRACT_ADDRESS

        let parsedData
        if (isErc20) {
            parsedData = parseSmartContractDataWithErc20Abi(evmNetwork, rawData, recipientAddress)
        } else if (isErc721) {
            parsedData = parseSmartContractDataWithErc721Abi(evmNetwork, rawData, recipientAddress)
        } else if (isIscContract) {
            parsedData = parseSmartContractDataWithIscMagicAbi(evmNetwork, rawData, recipientAddress)
        }

        return parsedData ?? parseSmartContractDataWithMethodRegistry(rawData, recipientAddress)
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
    data: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const iscMagicDecoder = new AbiDecoder(ISC_SANDBOX_ABI, network.provider)
    const decodedData = iscMagicDecoder.decodeData(data) // TODO: Type this return

    if (!decodedData) {
        return undefined
    }

    const rawMethod = data.substring(0, 10)
    const parsedMethod: IParsedMethod = {
        name: decodedData.name,
        inputs: Object.values(decodedData.inputs),
    }

    switch (decodedData.name) {
        case 'call': {
            if (!isIscNetwork(network)) {
                return undefined
            }

            const inputs = decodedData.inputs as unknown as IscCallMethodInputs
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
                    parsedMethod,
                    rawMethod,
                    recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                }
            } else if (nftId) {
                return {
                    type: ParsedSmartContractType.NftTransfer,
                    nftId,
                    parsedMethod,
                    rawMethod,
                    recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                }
            } else {
                return { type: ParsedSmartContractType.SmartContract, recipientAddress, rawMethod, parsedMethod }
            }
        }
        case 'send': {
            if (!isIscNetwork(network)) {
                return undefined
            }

            const inputs = decodedData.inputs as unknown as IscSendMethodInputs
            const nativeToken = inputs?.assets?.nativeTokens?.[0]
            const nftId = inputs?.assets?.nfts?.[0]
            const baseTokenAmount = BigInt(inputs.assets.baseTokens)

            if (nativeToken) {
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    tokenId: nativeToken.ID.data,
                    rawAmount: BigInt(nativeToken.amount),
                    rawMethod,
                    parsedMethod,
                    additionalBaseTokenAmount: baseTokenAmount,
                    recipientAddress, // for now, set it to the magic contract address
                }
            }
            if (nftId) {
                return {
                    type: ParsedSmartContractType.NftTransfer,
                    nftId,
                    rawMethod,
                    parsedMethod,
                    additionalBaseTokenAmount: baseTokenAmount,
                    recipientAddress, // for now, set it to the magic contract address
                }
            } else if (baseTokenAmount) {
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    tokenId: BASE_TOKEN_ID,
                    rawAmount: network.denormaliseAmount(baseTokenAmount),
                    rawMethod,
                    parsedMethod,
                    recipientAddress, // for now, set it to the magic contract address
                }
            }

            return { type: ParsedSmartContractType.SmartContract, recipientAddress, rawMethod, parsedMethod }
        }
        default:
            return { type: ParsedSmartContractType.SmartContract, recipientAddress, rawMethod, parsedMethod }
    }
}

function parseSmartContractDataWithErc20Abi(
    network: IEvmNetwork,
    data: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const erc20Decoder = new AbiDecoder(ERC20_ABI, network.provider)
    const decodedData = erc20Decoder.decodeData(data) // TODO: Type this return

    if (!decodedData) {
        return undefined
    }

    const rawMethod = data.substring(0, 10)
    const parsedMethod: IParsedMethod = {
        name: decodedData.name,
        inputs: Object.values(decodedData.inputs),
    }

    switch (decodedData.name) {
        case 'transfer': {
            const inputs = decodedData.inputs as unknown as Erc20TransferMethodInputs

            return {
                type: ParsedSmartContractType.TokenTransfer,
                tokenId: recipientAddress,
                rawAmount: BigInt(inputs._value),
                rawMethod,
                parsedMethod,
                recipientAddress: inputs._to,
            }
        }
        // TODO: Support more ERC20 methods
        default: {
            return {
                type: ParsedSmartContractType.SmartContract,
                rawMethod,
                parsedMethod,
                recipientAddress,
            }
        }
    }
}

function parseSmartContractDataWithErc721Abi(
    network: IEvmNetwork,
    data: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const erc721Decoder = new AbiDecoder(ERC721_ABI, network.provider)
    const decodedData = erc721Decoder.decodeData(data) // TODO: Type this return

    if (!decodedData) {
        return undefined
    }

    const rawMethod = data.substring(0, 10)
    const parsedMethod: IParsedMethod = {
        name: decodedData.name,
        inputs: Object.values(decodedData.inputs),
    }

    switch (decodedData.name) {
        case 'safeTransferFrom': {
            // Enum?
            const inputs = decodedData.inputs as unknown as Erc721SafeTransferMethodInputs

            return {
                type: ParsedSmartContractType.NftTransfer,
                nftId: `${recipientAddress}:${inputs.tokenId}`,
                rawMethod,
                parsedMethod,
                recipientAddress: inputs.to,
            }
        }
        // TODO: support more ERC721 methods
        default: {
            return {
                type: ParsedSmartContractType.SmartContract,
                recipientAddress,
                rawMethod,
                parsedMethod,
            }
        }
    }
}

function parseSmartContractDataWithMethodRegistry(
    rawData: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
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

        return {
            type: ParsedSmartContractType.SmartContract,
            recipientAddress,
            rawMethod: fourBytePrefix,
            parsedMethod: { name, inputs: parameters },
        }
    } catch (error) {
        return undefined
    }
}
