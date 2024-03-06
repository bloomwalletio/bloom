import { IBlockscoutTokenTransfer, IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { LocalEvmTransaction } from './local-evm-transaction.interface'

export type PersistedTransaction =
    | {
          blockscout: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local: LocalEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local: LocalEvmTransaction
      }
    | {
          blockscout: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local?: LocalEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local?: LocalEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer?: IBlockscoutTokenTransfer
          local: LocalEvmTransaction
      }
