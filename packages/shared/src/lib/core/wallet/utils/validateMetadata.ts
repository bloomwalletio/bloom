import { MAX_METADATA_BYTES, getByteLengthOfString } from '@core/utils'
import { MetadataLengthError } from '../errors'

export function validateMetadata(metadata: string): void {
    if (getByteLengthOfString(metadata) > MAX_METADATA_BYTES) {
        throw new MetadataLengthError()
    }
}
