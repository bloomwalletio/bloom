import { INft } from '@core/nfts'
import { IAsset } from '@core/wallet'
import { AssetType } from '../enums'

export type TransferredAsset =
    | {
          type: AssetType.Token
          asset: IAsset
          amount: string
      }
    | {
          type: AssetType.BaseCoin
          asset: IAsset
          amount: string
      }
    | {
          type: AssetType.Nft
          nft: INft
      }
