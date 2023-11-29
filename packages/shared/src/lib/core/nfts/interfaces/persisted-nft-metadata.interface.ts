import { NftStandard } from '../enums'
import { INftInstance } from '../interfaces'
import { NftMetadata } from '../types'

export interface IPersistedNftMetadata {
    standard: NftStandard
    metadata: NftMetadata
    instances?: INftInstance[]
    contentType?: string
    contentLength?: string
    responseCode?: number
    downloadUrl?: string
    error?: { message: string }
}
