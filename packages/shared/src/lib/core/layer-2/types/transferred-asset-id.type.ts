import { AssetType } from '../enums'

export type TransferredAssetId =
    | {
          type: AssetType.Token
          tokenId: string
          rawAmount: string
      }
    | {
          type: AssetType.BaseCoin
          tokenId: string
          rawAmount: string
      }
    | {
          type: AssetType.Nft
          nftId: string
      }
