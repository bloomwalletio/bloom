import { IBlockscoutAssetMetadata } from './blockscout-asset-metadata.interface'

interface IFee {
    type: 'maximum' | 'actual'
    value: string
}

interface IAddressTag {
    address_hash: string
    display_name: string
    label: string
}

interface IWatchlistName {
    display_name: string
    label: string
}

interface IAddressParam {
    hash: string
    implementation_name: string
    name: string
    is_contract: boolean
    private_tags: IAddressTag[]
    watchlist_names: IWatchlistName[]
    public_tags: IAddressTag[]
    is_verified: boolean
}

interface IDecodedInput {
    method_call: string
    method_id: string
    parameters: Record<string, string> // IDecodedInputParameters
}

interface ITokenTransfer {
    block_hash: string
    from: IAddressParam
    log_index: string
    method: string
    timestamp: string
    to: IAddressParam
    token: IBlockscoutAssetMetadata
}

enum BlockscoutTransactionType {
    TokenTransfer = 'token_transfer',
    ContractCreation = 'contract_creation',
    ContractCall = 'contract_call',
    TokenCreation = 'token_creation',
    CoinTransfer = 'coin_transfer',
}

export enum BlockscoutTransactionStatus {
    Ok = 'ok',
    Error = 'error',
}

export interface IBlockscoutTransaction {
    timestamp: string
    fee: IFee
    gas_limit: number
    block: number
    status: BlockscoutTransactionStatus
    method: string // e.g transferFrom
    confirmations: number
    type: number
    exchange_rate: string
    to: IAddressParam
    tx_burnt_fee: string
    max_fee_per_gas: string
    result: string
    hash: string
    gas_price: string
    priority_fee: string
    base_fee_per_gas: string
    from: IAddressParam
    token_transfers: ITokenTransfer[]
    tx_types: BlockscoutTransactionType[]
    gas_used: string
    created_contract: IAddressParam
    position: number
    nonce: number
    has_error_in_internal_txs: boolean
    actions: unknown // TransactionAction
    decoded_input: IDecodedInput
    token_transfers_overflow: boolean
    raw_input: string
    value: string
    max_priority_fee_per_gas: string
    revert_reason: string
    confirmation_duration: string
    tx_tag: string
}
