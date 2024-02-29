import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { PersistedEvmTransaction } from '@core/activity'

export type PersistedTransaction =
    | {
          blockscout: IBlockscoutTransaction
          local: PersistedEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          local: PersistedEvmTransaction
      }
    | {
          blockscout: IBlockscoutTransaction
          local?: PersistedEvmTransaction
      }
