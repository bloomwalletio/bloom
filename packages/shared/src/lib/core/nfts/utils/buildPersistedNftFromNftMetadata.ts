import { NftStandard } from '../enums'
import { INftInstance, IPersistedNft } from '../interfaces'
import { NftMetadata } from '../types'

export function buildPersistedNftFromNftMetadata(metadata: NftMetadata, instances?: INftInstance[]): IPersistedNft {
    return {
        standard: metadata.standard as NftStandard.Irc27,
        metadata,
        instances: instances ?? [],
    }
}
