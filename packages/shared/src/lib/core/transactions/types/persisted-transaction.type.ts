import { IBlockscoutTokenTransfer, IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { PersistedEvmTransaction } from '@core/activity'

export type PersistedTransaction =
    | {
          blockscout: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local: PersistedEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local: PersistedEvmTransaction
      }
    | {
          blockscout: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local?: PersistedEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          tokenTransfer: IBlockscoutTokenTransfer
          local?: PersistedEvmTransaction
      }
