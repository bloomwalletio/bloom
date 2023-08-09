import { INft } from '@core/nfts'
import { IToken } from '@core/token'
import { AssetType } from '../enums'

export type TransferredAsset =
    | {
          type: AssetType.Token
          token: IToken
          amount: string
      }
    | {
          type: AssetType.BaseCoin
          token: IToken
          amount: string
      }
    | {
          type: AssetType.Nft
          nft: INft
      }
