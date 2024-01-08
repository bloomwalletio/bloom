import { Platform } from '@core/app/classes'
import features from '@features/features'
import { StatusCodes } from 'http-status-codes'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType } from '../enums'
import { DownloadMetadata, INft } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'

export async function checkIfNftShouldBeDownloaded(
    nft: INft
): Promise<{ shouldDownload: boolean; isLoaded: boolean; downloadMetadata: DownloadMetadata }> {
    let downloadMetadata: DownloadMetadata = nft.downloadMetadata ?? {}

    try {
        const alreadyDownloaded =
            features?.collectibles?.useCaching?.enabled && nft.downloadMetadata?.filePath
                ? await Platform.checkIfFileExists(`${nft.downloadMetadata.filePath}/${NFT_MEDIA_FILE_NAME}`)
                : false

        if (alreadyDownloaded) {
            return {
                shouldDownload: false,
                isLoaded: true,
                downloadMetadata: { ...downloadMetadata, error: undefined, warning: undefined },
            }
        }

        if (!nft.composedUrl) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        const notRecoverableErrors: StatusCodes[] = [] // TODO: Define which errors we want to blacklist

        const persistedNftDownloadMetadata = get(persistedNftForActiveProfile)?.[nft.id]?.downloadMetadata
        const shouldSkipFetch =
            persistedNftDownloadMetadata?.responseCode &&
            notRecoverableErrors.includes(persistedNftDownloadMetadata.responseCode)
        if (shouldSkipFetch) {
            return {
                shouldDownload: false,
                isLoaded: false,
                downloadMetadata: { ...downloadMetadata, ...persistedNftDownloadMetadata },
            }
        }

        if (features.collectibles.useCaching.enabled) {
            return {
                shouldDownload: true,
                isLoaded: false,
                downloadMetadata: {
                    ...downloadMetadata,
                    error: undefined,
                    warning: undefined,
                },
            }
        } else {
            return {
                shouldDownload: false,
                isLoaded: true,
                downloadMetadata: {
                    ...downloadMetadata,
                    downloadUrl: nft.composedUrl,
                    error: undefined,
                    warning: undefined,
                },
            }
        }
    } catch (err) {
        console.error(err)
        downloadMetadata = { ...downloadMetadata, error: { type: DownloadErrorType.Generic, message: err.message } }

        return { shouldDownload: false, isLoaded: false, downloadMetadata }
    }
}
