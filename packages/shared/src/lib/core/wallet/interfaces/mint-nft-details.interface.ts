import { IIrc27Metadata } from '@core/nfts'

export interface IMintNftDetails extends IIrc27Metadata {
    collectionId?: string
    quantity: number
}
