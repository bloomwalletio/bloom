import { IBlockscoutAddressParam } from '../interfaces/blockscout-address-param.interface'
import { BlockscoutTransactionType } from '../enums/blockscout-transaction-type.enum'
import { IBlockscoutTokenInfoDto } from '../interfaces/blockscout-token-info.interface'

type BlockscoutTokenTransferBase = {
    block_hash: string
    from: IBlockscoutAddressParam
    log_index: string
    method: string // could be an enum?
    timestamp: string
    to: IBlockscoutAddressParam
    tx_hash: string
    type: BlockscoutTransactionType.TokenTransfer | BlockscoutTransactionType.TokenMinting
}

export type BlockscoutErc20Transfer = BlockscoutTokenTransferBase & {
    token: IBlockscoutTokenInfoDto & { type: 'ERC-20' }
    total: {
        decimals: number
        value: number
    }
}

export function isBlockscoutErc20Transfer(
    tokenTransfer: BlockscoutTokenTransfer
): tokenTransfer is BlockscoutErc20Transfer {
    return tokenTransfer.token.type === 'ERC-20'
}

export type BlockscoutErc721Transfer = BlockscoutTokenTransferBase & {
    token: IBlockscoutTokenInfoDto & { type: 'ERC-721' }
    total: { token_id: string }
}

export function isBlockscoutErc721Transfer(
    tokenTransfer: BlockscoutTokenTransfer
): tokenTransfer is BlockscoutErc721Transfer {
    return tokenTransfer.token.type === 'ERC-721'
}

export type BlockscoutTokenTransfer = BlockscoutErc20Transfer | BlockscoutErc721Transfer
