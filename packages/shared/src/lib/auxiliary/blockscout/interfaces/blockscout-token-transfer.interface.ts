import { IBlockscoutAddressParam } from './blockscout-address-param.interface'
import { BlockscoutTransactionType } from '../enums/blockscout-transaction-type.enum'
import { IBlockscoutTokenInfo } from './blockscout-token-info.interface'

export interface IBlockscoutTokenTransfer {
    block_hash: string
    from: IBlockscoutAddressParam
    log_index: string
    method: string // could be an enum?
    timestamp: string
    to: IBlockscoutAddressParam
    token: IBlockscoutTokenInfo
    total: {
        decimals: number
        value: number
    }
    tx_hash: string
    type: BlockscoutTransactionType.TokenTransfer
}
