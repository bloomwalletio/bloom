import { IIrc27Metadata } from '@core/nfts'

export interface IMintNftCollectionDetails extends Omit<IIrc27Metadata, 'royalties' | 'collectionName'> {}
