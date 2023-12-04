import { IPersistedNft } from './persisted-nft.interface'

export interface IPersistedNfts {
    [profileId: string]: {
        [nftId: string]: IPersistedNft
    }
}
