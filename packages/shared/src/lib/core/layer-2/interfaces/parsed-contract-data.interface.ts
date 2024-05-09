import { ParsedSmartContractType } from '../enums'

export interface IParsedCoinTransfer {
    type: ParsedSmartContractType.CoinTransfer
    rawAmount: bigint
    recipientAddress: string
}

export interface IParsedTokenTransfer extends IParsedSmartContractData {
    type: ParsedSmartContractType.TokenTransfer
    tokenId: string
    rawAmount: bigint
}

export interface IParsedNftTransfer extends IParsedSmartContractData {
    type: ParsedSmartContractType.NftTransfer
    nftId: string
}

export interface IParsedSmartContractData {
    type: ParsedSmartContractType
    rawMethod: string
    parsedMethod?: IParsedMethod
    additionalBaseTokenAmount?: bigint
    recipientAddress: string
}

export interface IParsedMethod {
    name: string
    inputs: IParsedInput[]
}

export interface IParsedInput {
    name: string
    type: string
    value: unknown
}
