import {
    IParsedTokenApproval,
    IParsedCoinTransfer,
    IParsedNftTransfer,
    IParsedSmartContractData,
    IParsedTokenTransfer,
} from '../interfaces/parsed-contract-data.interface'

export type ParsedSmartContractData =
    | IParsedCoinTransfer
    | IParsedTokenTransfer
    | IParsedNftTransfer
    | IParsedTokenApproval
    | IParsedSmartContractData
