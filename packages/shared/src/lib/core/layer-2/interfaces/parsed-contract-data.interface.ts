import { TokenStandard } from '@core/token'
import { ParsedSmartContractType } from '../enums'
import { NftStandard } from '@core/nfts'

export interface IParsedCoinTransfer extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.CoinTransfer
    rawAmount: bigint
}

export interface IParsedTokenTransfer extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.TokenTransfer
    standard: TokenStandard.Erc20 | TokenStandard.Irc30 | TokenStandard.BaseToken
    tokenId: string
    rawAmount: bigint
}

export interface IParsedNftTransfer extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.NftTransfer
    standard: NftStandard.Erc721 | NftStandard.Irc27
    nftId: string
}

export interface IParsedTokenApproval extends Omit<IParsedSmartContractData, 'type'> {
    type: ParsedSmartContractType.TokenApproval
    standard: TokenStandard.Erc20 | TokenStandard.BaseToken
    spender: string
    tokenId: string
    rawAmount: bigint
}

export interface IParsedSmartContractData {
    type: ParsedSmartContractType.SmartContract
    rawData: string
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
