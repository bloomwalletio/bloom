import { INft } from '@core/nfts'
import { IToken } from '@core/token'

export type DisplayedAsset = { type: 'token'; token: IToken; rawAmount: string } | { type: 'nft'; nft: INft }
