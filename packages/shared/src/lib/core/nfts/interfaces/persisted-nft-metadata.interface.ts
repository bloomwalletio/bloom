import { NftStandard } from '../enums'

export interface IPersistedNftMetadata {
    standard: NftStandard
    contentType?: string
    contentLength?: string
    responseCode?: number
    downloadUrl?: string
    error?: { message: string }
}
