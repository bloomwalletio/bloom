import { DownloadErrorType, DownloadWarningType } from '../enums'

export interface INftDownloadStatus {
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
