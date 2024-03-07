import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { LocalEvmTransaction } from './local-evm-transaction.interface'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'

export type PersistedTransaction =
    | {
          blockscout: IBlockscoutTransaction
          tokenTransfer: BlockscoutTokenTransfer
          local: LocalEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer: BlockscoutTokenTransfer
          local: LocalEvmTransaction
      }
    | {
          blockscout: IBlockscoutTransaction
          tokenTransfer: BlockscoutTokenTransfer
          local?: LocalEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer: BlockscoutTokenTransfer
          local?: LocalEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer?: BlockscoutTokenTransfer
          local: LocalEvmTransaction
      }
