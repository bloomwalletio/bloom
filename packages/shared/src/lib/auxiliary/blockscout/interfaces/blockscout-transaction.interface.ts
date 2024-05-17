import { BlockscoutTransactionStatus } from '../enums'
import { BlockscoutTransactionType } from '../enums/blockscout-transaction-type.enum'
import { IBlockscoutAddressParam } from './blockscout-address-param.interface'
import { IBlockscoutTokenInfoDto } from './blockscout-token-info.interface'

interface IFee {
    type: 'maximum' | 'actual'
    value: string
}

export interface IAddressTag {
    address_hash: string
    display_name: string
    label: string
}

export interface IWatchlistName {
    display_name: string
    label: string
}

interface IDecodedInput {
    method_call: string
    method_id: string
    parameters: { name: string; type: string; value: unknown }[] // IDecodedInputParameters
}

interface ITokenTransfer {
    block_hash: string
    from: IBlockscoutAddressParam
    log_index: string
    method: string
    timestamp: string
    to: IBlockscoutAddressParam
    token: IBlockscoutTokenInfoDto
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
    to: IBlockscoutAddressParam
    tx_burnt_fee: string
    max_fee_per_gas: string
    result: string
    hash: string
    gas_price: string
    priority_fee: string
    base_fee_per_gas: string
    from: IBlockscoutAddressParam
    token_transfers: ITokenTransfer[]
    tx_types: BlockscoutTransactionType[]
    gas_used: string
    created_contract: IBlockscoutAddressParam
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
