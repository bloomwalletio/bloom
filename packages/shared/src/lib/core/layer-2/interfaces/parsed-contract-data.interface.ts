import { ParsedSmartContractType } from '../enums'

export interface IParsedCoinTransfer extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.CoinTransfer
    rawAmount: bigint
    recipientAddress: string
}

export interface IParsedTokenTransfer extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.TokenTransfer
    tokenId: string
    rawAmount: bigint
}

export interface IParsedNftTransfer extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.NftTransfer
    nftId: string
}

export interface IParsedSmartContractData {
    type: ParsedSmartContractType.SmartContract
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
