import { INft } from '@core/nfts/interfaces'
import { IToken } from '@core/token/interfaces'

export type DisplayedAsset = { type: 'token'; token: IToken; rawAmount: string } | { type: 'nft'; nft: INft }
