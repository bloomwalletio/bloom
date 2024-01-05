import { Platform } from '@core/app/classes'
import { activeProfile } from '@core/profile/stores'
import { BYTES_PER_MEGABYTE, HttpHeader } from '@core/utils'
import features from '@features/features'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadWarningType, MimeType } from '../enums'
import { DownloadMetadata, IIrc27Nft, INft, INftDownloadStatus } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'
import { fetchWithTimeout } from './fetchWithTimeout'
import { isIrc27Nft } from '@core/nfts/utils/isIrc27Nft'
import { buildFilePath } from './getFilePathForNft'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

const HEAD_FETCH_TIMEOUT_SECONDS = 5
const UNREACHABLE_ERROR_MESSAGE = 'The user aborted a request.'

export async function checkIfNftShouldBeDownloaded(
    nft: INft
): Promise<{ shouldDownload: boolean; isLoaded: boolean, downloadMetadata: DownloadMetadata; }> {
    console.log(nft.id, 'checkIfNftShouldBeDownloaded')
    let downloadMetadata: DownloadMetadata = nft.downloadMetadata ?? {}

    try {
        const alreadyDownloaded =
            features?.collectibles?.useCaching?.enabled && nft.downloadMetadata?.filePath
                ? await Platform.checkIfFileExists(`${nft.downloadMetadata.filePath}/${NFT_MEDIA_FILE_NAME}`)
                : false

        if (alreadyDownloaded) {
            console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'alreadyDownloaded')
            return {
                shouldDownload: false,
                isLoaded: true,
                downloadMetadata: clearErrorsFromDownloadMetadata(downloadMetadata),
            }
        }

        if (!nft.composedUrl) {
            console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'no composedUrl')
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

        const response = await headRequest(nft.composedUrl)
        console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'response', response)
        downloadMetadata = { ...downloadMetadata, ...buildDownloadDataFromResponse(response) }

        if (downloadMetadata.responseCode !== StatusCodes.OK) {
            console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'responseCode', downloadMetadata.responseCode)
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        const validate = validateFile(nft, downloadMetadata.contentType ?? '', downloadMetadata.contentLength ?? '')
        if (validate?.error || validate?.warning) {
            console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'validation error or warning', validate)
            downloadMetadata = { ...downloadMetadata, ...validate }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        } else {
            if (features.collectibles.useCaching.enabled) {
                console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'shouldDownload')
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
    } catch (err) {
        console.log(nft.id, 'checkIfNftShouldBeDownloaded', 'error', err)
        console.error(err)

        if (err?.message === UNREACHABLE_ERROR_MESSAGE) {
            downloadMetadata.error = { type: DownloadErrorType.NotReachable, message: err.message }
        } else {
            downloadMetadata = { error: { type: DownloadErrorType.Generic, message: err.message }, ...downloadMetadata }
        }

        return { shouldDownload: false, downloadMetadata, isLoaded: false }
    }
}

function validateFile(nft: INft, contentType: string, contentLength: string): Partial<INftDownloadStatus> | undefined {
    console.log(nft.id, 'validateFile')
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType = isIrc27Nft(nft) ? contentType === String(nft.metadata?.type) : true
    const isTooLarge = MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
    if (!isValidMediaType) {
        return { error: { type: DownloadErrorType.NotMatchingFileTypes } }
    } else if (isTooLarge) {
        return { warning: { type: DownloadWarningType.TooLargeFile } }
    }
}

async function headRequest(url: string): Promise<Response> {
    return fetchWithTimeout(url, HEAD_FETCH_TIMEOUT_SECONDS, {
        method: 'HEAD',
        cache: 'force-cache',
    })
}

function clearErrorsFromDownloadMetadata(downloadMetadata: DownloadMetadata): DownloadMetadata {
    return { ...downloadMetadata, error: undefined, warning: undefined }
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

async function getNftDownloadData(nft: INft): Promise<Partial<DownloadMetadata>> {
    console.log(nft.id, 'getNftDownloadData', nft)
    const persistedNftData = get(persistedNftForActiveProfile)?.[nft.id]
    const shouldFetch =
        !persistedNftData?.downloadMetadata ||
        persistedNftData.downloadMetadata.error?.type === DownloadErrorType.NotReachable

    if (shouldFetch) {
        console.log(nft.id, 'getNftDownloadData', 'shouldFetch')
        let downloadUrl = nft.composedUrl

        console.log(nft.id, 'getNftDownloadData', 'fetchWithTimeout', downloadUrl)
        let response = await fetchWithTimeout(downloadUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
            method: 'HEAD',
            cache: 'force-cache',
        })
        console.log(nft.id, 'getNftDownloadData', 'fetchWithTimeout', 'end', response)
        const isSoonaverse = isIrc27Nft(nft) && nft.metadata?.issuerName === 'Soonaverse'
        if (isSoonaverse) {
            const newUrlAndHeaders = await getUrlAndHeadersFromOldSoonaverseStructure(nft, response)
            downloadUrl = newUrlAndHeaders?.url ?? downloadUrl
            response = newUrlAndHeaders?.response ?? response
        }

        return {
            downloadUrl,
            filePath: buildFilePath(nft),
            contentLength: response.headers.get(HttpHeader.ContentLength) || undefined,
            contentType: response.headers.get(HttpHeader.ContentType) || undefined,
            responseCode: response.status,
        }
    } else {
        console.log(nft.id, 'getNftDownloadData', 'shouldNotFetch', persistedNftData.downloadMetadata)
        if (persistedNftData.downloadMetadata?.error) {
            throw persistedNftData.downloadMetadata.error
        }
        return persistedNftData.downloadMetadata
    }
}

async function getUrlAndHeadersFromOldSoonaverseStructure(
    nft: IIrc27Nft,
    response: Response
): Promise<{ url: string; response: Response } | undefined> {
    const isContentTypeEqualNftType = (response.headers.get(HttpHeader.ContentType) as MimeType) === nft.metadata?.type
    if (!isContentTypeEqualNftType) {
        const backupUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.name)
        const backupResponse = await fetchWithTimeout(backupUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
            method: 'HEAD',
            cache: 'force-cache',
        })
        return { url: backupUrl, response: backupResponse }
    }
}
