import { PersistedNft } from '../types'

export interface IPersistedNfts {
    [profileId: string]: {
        [nftId: string]: PersistedNft
    }
}
