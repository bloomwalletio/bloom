import { DownloadErrorType, DownloadWarningType } from '../enums'

export interface IDownloadMetadata {
    contentType?: string
    contentLength?: string
    responseCode?: number
    downloadUrl?: string
    filePath?: string
    error?: {
        type: DownloadErrorType
        message?: string
    }
    warning?: {
        type: DownloadWarningType
        message?: string
    }
}
