import { INft } from '@core/nfts'
import { IAsset } from '@core/wallet'

export type DisplayedAsset = { type: 'token'; asset: IAsset; rawAmount: string } | { type: 'nft'; nft: INft }
