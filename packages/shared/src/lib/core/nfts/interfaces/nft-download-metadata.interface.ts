import { DownloadErrorType, DownloadWarningType } from '../enums'

// TODO: -> NftDownloadStatus, and create INftDownloadMetadata
export interface NftDownloadMetadata {
    isLoaded: boolean
    error?: {
        type: DownloadErrorType
        message?: string
    }
    warning?: {
        type: DownloadWarningType
        message?: string
    }
}
