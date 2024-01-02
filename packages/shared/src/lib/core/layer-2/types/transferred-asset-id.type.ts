import { AssetType } from '../enums'

export type TransferredAssetId =
    | {
          type: AssetType.Token
          tokenId: string
          rawAmount: bigint
      }
    | {
          type: AssetType.BaseCoin
          tokenId: string
          rawAmount: bigint
      }
    | {
          type: AssetType.Nft
          nftId: string
      }
