import { NftStandard } from '../enums'
import { IPersistedNftMetadata } from '../interfaces'
import { NftMetadata } from '../types'

export function buildPersistedNftFromNftMetadata(metadata: NftMetadata): IPersistedNftMetadata {
    return {
        standard: metadata.standard as NftStandard,
        metadata,
    }
}
