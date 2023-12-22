import { INft } from '@core/nfts/interfaces'
import { IToken } from '@core/token/interfaces'
import { AssetType } from '../enums'

export type TransferredAsset =
    | {
          type: AssetType.Token
          token: IToken
          amount: bigint
      }
    | {
          type: AssetType.BaseCoin
          token: IToken
          amount: bigint
      }
    | {
          type: AssetType.Nft
          nft: INft
      }
