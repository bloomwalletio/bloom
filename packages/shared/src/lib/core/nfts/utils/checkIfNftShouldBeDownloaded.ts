import { Platform } from '@core/app/classes'
import { activeProfile } from '@core/profile/stores'
import { BYTES_PER_MEGABYTE, HttpHeader } from '@core/utils'
import features from '@features/features'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadWarningType } from '../enums'
import { DownloadMetadata, INft } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'
import { fetchWithTimeout } from './fetchWithTimeout'
import { buildFilePath } from './getFilePathForNft'
import { isIrc27Nft } from './isIrc27Nft'

const HEAD_FETCH_TIMEOUT_SECONDS = 10

export async function checkIfNftShouldBeDownloaded(
    nft: INft
): Promise<{ shouldDownload: boolean; isLoaded: boolean, downloadMetadata: DownloadMetadata; }> {
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
                downloadMetadata: clearErrorsFromDownloadMetadata(downloadMetadata),
            }
        }

        if (!nft.composedUrl) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        const notRecoverableErrors: StatusCodes[] = [] // TODO: Define which errors we want to blacklist

        const persistedNftDownloadMetadata= get(persistedNftForActiveProfile)?.[nft.id]?.downloadMetadata
        const shouldSkipFetch = persistedNftDownloadMetadata?.responseCode && notRecoverableErrors.includes(persistedNftDownloadMetadata.responseCode)
        if (shouldSkipFetch) {
            return {
                shouldDownload: false,
                isLoaded: false,
                downloadMetadata: { ...downloadMetadata, ...persistedNftDownloadMetadata },
            }
        }

        return checkHeadRequestForNftUrl(nft, downloadMetadata, isIrc27Nft(nft) && nft.metadata?.issuerName === 'Soonaverse')
    } catch (err) {
        console.error(err)
        downloadMetadata = { ...downloadMetadata, error: { type: DownloadErrorType.Generic, message: err.message } }

        return { shouldDownload: false, isLoaded: false, downloadMetadata }
    }
}

async function checkHeadRequestForNftUrl(nft: INft, downloadMetadata: DownloadMetadata, shouldCheckSoonaverseFallback: boolean): Promise<{ shouldDownload: boolean; isLoaded: boolean, downloadMetadata: DownloadMetadata }> {
    const response = await headRequest(nft.composedUrl)
    downloadMetadata = { ...downloadMetadata, ...buildDownloadDataFromResponse(response) }

    if (downloadMetadata.responseCode === StatusCodes.OK) {
        return setReturnForOkResponse(nft, downloadMetadata, shouldCheckSoonaverseFallback)
    } else {
        return { shouldDownload: false, isLoaded: false, downloadMetadata }
    }
}

async function setReturnForOkResponse(nft: INft, downloadMetadata: DownloadMetadata, shouldCheckSoonaverseFallback: boolean): Promise<{ shouldDownload: boolean; isLoaded: boolean, downloadMetadata: DownloadMetadata }> {
    if (!isExpectedContentType(nft, downloadMetadata)) {
        if (shouldCheckSoonaverseFallback) {
            nft.composedUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.name)
            return checkHeadRequestForNftUrl(nft, downloadMetadata, false)
        }

        downloadMetadata.error = { type: DownloadErrorType.NotMatchingFileTypes }
        return { shouldDownload: false, isLoaded: false, downloadMetadata }
    }

    if (isFileTooLarge(downloadMetadata.contentLength ?? '')) {
        downloadMetadata.warning = { type: DownloadWarningType.TooLargeFile }
        return { shouldDownload: false, isLoaded: false, downloadMetadata }
    }

    return setReturnForHappyPath(nft, downloadMetadata)
}

function setReturnForHappyPath(nft: INft, downloadMetadata: DownloadMetadata): { shouldDownload: boolean; isLoaded: boolean, downloadMetadata: DownloadMetadata } {
    if (features.collectibles.useCaching.enabled) {
        return {
            shouldDownload: true,
            isLoaded: false,
            downloadMetadata: {
                ...downloadMetadata,
                downloadUrl: nft.composedUrl,
                filePath: buildFilePath(nft),
                error: undefined,
                warning: undefined
            },
        }
    } else {
        return {
            shouldDownload: false,
            isLoaded: true,
            downloadMetadata: {
                ...downloadMetadata,
                downloadUrl: nft.composedUrl,
                filePath: buildFilePath(nft),
                error: undefined,
                warning: undefined
            },
        }
    }
}

async function headRequest(url: string): Promise<Response> {
    return fetchWithTimeout(url, HEAD_FETCH_TIMEOUT_SECONDS, {
        method: 'HEAD',
        cache: 'force-cache',
    })
}

function buildDownloadDataFromResponse(response: Response): Partial<DownloadMetadata> {

    if (response.status === Number(StatusCodes.OK)) {
        return {
            contentLength: response.headers.get(HttpHeader.ContentLength) || undefined,
            contentType: response.headers.get(HttpHeader.ContentType) || undefined,
            responseCode: response.status,
        }
    } else {
        return {
            responseCode: response.status,
            error: {
                type: DownloadErrorType.Generic,
                message: getReasonPhrase(response.status),
            },
        }
    }
}

function clearErrorsFromDownloadMetadata(downloadMetadata: DownloadMetadata): DownloadMetadata {
    return { ...downloadMetadata, error: undefined, warning: undefined }
}

function isFileTooLarge(contentLength: string): boolean {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE
    return MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
}

function isExpectedContentType(nft: INft, downloadMetadata: DownloadMetadata): boolean {
    if (!nft.metadata?.type || !downloadMetadata.contentType) {
        return false
    }

    return downloadMetadata.contentType === String(nft.metadata.type)
}
