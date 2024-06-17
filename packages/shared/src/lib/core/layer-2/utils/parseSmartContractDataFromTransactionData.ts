import { ISC_MAGIC_CONTRACT_ABI } from '@core/isc/abis/isc-magic-contract.abi'
import { IEvmNetwork, isIscNetwork } from '@core/network'
import { NftStandard } from '@core/nfts'
import { TokenStandard } from '@core/token'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { AbiDecoder, HEX_PREFIX } from '@core/utils'
import { isTrackedNftAddress, isTrackedTokenAddress } from '@core/wallet/actions'
import { BigIntLike, BytesLike } from '@ethereumjs/util'
import { ERC20_ABI, ERC721_ABI } from '../abis'
import { ISC_BASE_COIN_ADDRESS, ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { ParsedSmartContractType } from '../enums'
import { IParsedInput, IParsedMethod } from '../interfaces'
import { Erc20Abi, Erc721Abi, IscAbi } from '../types'
import { ParsedSmartContractData } from '../types/parsed-smart-contract-data.type'
import { lookupMethodSignature } from './lookupMethodSignature'

export function parseSmartContractDataFromTransactionData(
    transaction: { to?: string; data: BytesLike; value?: BigIntLike },
    evmNetwork: IEvmNetwork
): ParsedSmartContractData | undefined {
    const recipientAddress = transaction?.to?.toLowerCase()
    if (!recipientAddress) {
        return undefined
    }

    const rawData = transaction.data as string
    const isErc20 = isTrackedTokenAddress(evmNetwork.id, recipientAddress) || recipientAddress === ISC_BASE_COIN_ADDRESS
    const isErc721 = isTrackedNftAddress(evmNetwork.id, recipientAddress)
    const isIscContract = recipientAddress === ISC_MAGIC_CONTRACT_ADDRESS

    let parsedData
    if (isIscContract) {
        parsedData = parseSmartContractDataWithIscMagicAbi(evmNetwork, rawData, recipientAddress)
    } else if (isErc20) {
        parsedData = parseSmartContractDataWithErc20Abi(evmNetwork, rawData, recipientAddress)
    } else if (isErc721) {
        parsedData = parseSmartContractDataWithErc721Abi(evmNetwork, rawData, recipientAddress)
    }

    return parsedData ?? parseSmartContractDataWithMethodRegistry(rawData, recipientAddress)
}

function parseSmartContractDataWithIscMagicAbi(
    network: IEvmNetwork,
    rawData: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const iscMagicDecoder = new AbiDecoder<IscAbi>(ISC_MAGIC_CONTRACT_ABI, network.provider)
    const decodedData = iscMagicDecoder.decodeData(rawData)

    if (!decodedData) {
        return undefined
    }

    const rawMethod = rawData.substring(0, 10)
    const parsedMethod: IParsedMethod = {
        name: decodedData.name,
        inputs: Object.values(decodedData.inputs),
    }

    switch (decodedData.name) {
        case 'call': {
            if (!isIscNetwork(network)) {
                return undefined
            }

            const inputs = decodedData.inputs
            const nativeToken = inputs?.allowance?.value?.nativeTokens?.[0]
            const nftId = inputs?.allowance?.value?.nfts?.[0]
            const agentId = inputs?.params?.value.items?.find((item) => item.key === '0x61')?.value

            if (nativeToken) {
                const rawAmount =
                    nativeToken.ID.data === BASE_TOKEN_ID
                        ? network.denormaliseAmount(nativeToken.amount)
                        : BigInt(nativeToken.amount)
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    standard: TokenStandard.Irc30,
                    tokenId: nativeToken.ID.data,
                    rawAmount,
                    parsedMethod,
                    rawData,
                    rawMethod,
                    recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                }
            } else if (nftId) {
                return {
                    type: ParsedSmartContractType.NftTransfer,
                    standard: NftStandard.Irc27,
                    nftId,
                    parsedMethod,
                    rawData,
                    rawMethod,
                    recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                }
            } else {
                return {
                    type: ParsedSmartContractType.SmartContract,
                    recipientAddress,
                    rawData,
                    rawMethod,
                    parsedMethod,
                }
            }
        }
        case 'send': {
            if (!isIscNetwork(network)) {
                return undefined
            }

            const inputs = decodedData.inputs
            const assets = inputs.assets?.value

            const nativeToken = assets?.nativeTokens?.[0]
            const nftId = assets?.nfts?.[0]
            const baseTokenAmount = BigInt(assets?.baseTokens ?? 0)

            if (nativeToken) {
                return {
                    type: ParsedSmartContractType.TokenTransfer,
                    standard: TokenStandard.Irc30,
                    tokenId: nativeToken.ID.data,
                    rawAmount: BigInt(nativeToken.amount),
                    rawData,
                    rawMethod,
                    parsedMethod,
                    additionalBaseTokenAmount: baseTokenAmount,
                    recipientAddress, // for now, set it to the magic contract address
                }
            }
            if (nftId) {
                return {
                    type: ParsedSmartContractType.NftTransfer,
                    standard: NftStandard.Irc27,
                    nftId,
                    rawData,
                    rawMethod,
                    parsedMethod,
                    additionalBaseTokenAmount: baseTokenAmount,
                    recipientAddress, // for now, set it to the magic contract address
                }
            } else if (baseTokenAmount) {
                return {
                    type: ParsedSmartContractType.CoinTransfer,
                    rawAmount: network.denormaliseAmount(baseTokenAmount),
                    rawData,
                    rawMethod,
                    parsedMethod,
                    recipientAddress, // for now, set it to the magic contract address
                }
            }

            return { type: ParsedSmartContractType.SmartContract, recipientAddress, rawData, rawMethod, parsedMethod }
        }
        default:
            return { type: ParsedSmartContractType.SmartContract, recipientAddress, rawData, rawMethod, parsedMethod }
    }
}

function parseSmartContractDataWithErc20Abi(
    network: IEvmNetwork,
    rawData: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const erc20Decoder = new AbiDecoder<Erc20Abi>(ERC20_ABI, network.provider)
    const decodedData = erc20Decoder.decodeData(rawData)

    if (!decodedData) {
        return undefined
    }

    const rawMethod = rawData.substring(0, 10)
    const parsedMethod: IParsedMethod = {
        name: decodedData.name,
        inputs: Object.values(decodedData.inputs),
    }

    switch (decodedData.name) {
        case 'transfer': {
            return {
                type: ParsedSmartContractType.TokenTransfer,
                standard: TokenStandard.Erc20,
                tokenId: recipientAddress,
                rawAmount: BigInt(decodedData.inputs._value.value),
                rawData,
                rawMethod,
                parsedMethod,
                recipientAddress: decodedData.inputs._to.value,
            }
        }
        case 'approve': {
            return {
                type: ParsedSmartContractType.TokenApproval,
                standard: TokenStandard.Erc20,
                tokenId: recipientAddress,
                spender: decodedData.inputs._spender.value,
                rawAmount: BigInt(decodedData.inputs._value.value),
                rawData,
                rawMethod,
                parsedMethod,
                recipientAddress,
            }
        }
        default: {
            return {
                type: ParsedSmartContractType.SmartContract,
                rawData,
                rawMethod,
                parsedMethod,
                recipientAddress,
            }
        }
    }
}

function parseSmartContractDataWithErc721Abi(
    network: IEvmNetwork,
    rawData: string,
    recipientAddress: string
): ParsedSmartContractData | undefined {
    const erc721Decoder = new AbiDecoder<Erc721Abi>(ERC721_ABI, network.provider)
    const decodedData = erc721Decoder.decodeData(rawData)

    if (!decodedData) {
        return undefined
    }

    const rawMethod = rawData.substring(0, 10)
    const parsedMethod: IParsedMethod = {
        name: decodedData.name,
        inputs: Object.values(decodedData.inputs),
    }

    switch (decodedData.name) {
        case 'safeTransferFrom': {
            // Enum?
            const inputs = decodedData.inputs

            return {
                type: ParsedSmartContractType.NftTransfer,
                standard: NftStandard.Erc721,
                nftId: `${recipientAddress}:${inputs.tokenId.value}`,
                rawData,
                rawMethod,
                parsedMethod,
                recipientAddress: inputs.to.value,
            }
        }
        // TODO: support more ERC721 methods
        default: {
            return {
                type: ParsedSmartContractType.SmartContract,
                recipientAddress,
                rawData,
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
        const inputsArr = matches[2] ?? ''
        const inputs: IParsedInput[] = inputsArr.split(',').map((param, index) => {
            // Method registry can either contain just `uint64` or `uint64 amount`
            const [type, name] = param.trim().split(' ')

            return {
                name: name ?? `param${index + 1}`,
                type,
                value: undefined,
            }
        })

        return {
            type: ParsedSmartContractType.SmartContract,
            recipientAddress,
            rawData,
            rawMethod: fourBytePrefix,
            parsedMethod: { name, inputs },
        }
    } catch (error) {
        return {
            type: ParsedSmartContractType.SmartContract,
            recipientAddress,
            rawData,
            rawMethod: fourBytePrefix,
        }
    }
}
