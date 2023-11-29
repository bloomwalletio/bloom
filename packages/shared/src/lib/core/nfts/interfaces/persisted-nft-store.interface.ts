import { IPersistedNftMetadata } from './persisted-nft-metadata.interface'

export interface IPersistedNftStore {
    [profileId: string]: {
        [nftId: string]: IPersistedNftMetadata
    }
}
