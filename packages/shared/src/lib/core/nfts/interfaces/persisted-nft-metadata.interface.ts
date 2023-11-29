import { NftStandard } from '../enums'
import { NftMetadata } from '../types'

export interface IPersistedNftMetadata {
    standard: NftStandard
    metadata: NftMetadata
    contentType?: string
    contentLength?: string
    responseCode?: number
    downloadUrl?: string
    error?: { message: string }
}
