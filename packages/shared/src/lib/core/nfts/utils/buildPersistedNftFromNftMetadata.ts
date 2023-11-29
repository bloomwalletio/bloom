import { NftStandard } from '../enums'
import { INftInstance, IPersistedNftMetadata } from '../interfaces'
import { NftMetadata } from '../types'

export function buildPersistedNftFromNftMetadata(
    metadata: NftMetadata,
    instances?: INftInstance[]
): IPersistedNftMetadata {
    return {
        standard: metadata.standard as NftStandard.Irc27,
        metadata,
        instances: instances ?? [],
    }
}
