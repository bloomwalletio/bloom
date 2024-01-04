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

const HEAD_FETCH_TIMEOUT_SECONDS = 3
const UNREACHABLE_ERROR_MESSAGE = 'The user aborted a request.'

export async function checkIfNftShouldBeDownloaded(
    nft: INft
): Promise<{ shouldDownload: boolean; downloadMetadata: DownloadMetadata; isLoaded: boolean }> {
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
                downloadMetadata: {
                    ...downloadMetadata,
                    error: undefined,
                    warning: undefined,
                },
            }
        } else if (!nft.composedUrl) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return { shouldDownload: false, downloadMetadata, isLoaded: false }
        } else {
            const nftData = await getNftDownloadData(nft)

            downloadMetadata = { ...downloadMetadata, ...nftData }

            const { contentType, contentLength } = downloadMetadata ?? {}

            const validation = validateFile(nft, contentType ?? '', contentLength ?? '')
            if (validation?.error || validation?.warning) {
                downloadMetadata = { ...downloadMetadata, ...validation }
                return { shouldDownload: false, downloadMetadata, isLoaded: false }
            } else {
                if (features.collectibles.useCaching.enabled) {
                    return {
                        shouldDownload: true,
                        isLoaded: false,
                        downloadMetadata: { ...downloadMetadata, error: undefined, warning: undefined },
                    }
                } else {
                    return {
                        shouldDownload: false,
                        isLoaded: true,
                        downloadMetadata: { ...downloadMetadata, error: undefined, warning: undefined },
                    }
                }
            }
        }
    } catch (err) {
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
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType = isIrc27Nft(nft) ? contentType === String(nft.metadata?.type) : true
    const isTooLarge = MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
    if (!isValidMediaType) {
        return { error: { type: DownloadErrorType.NotMatchingFileTypes } }
    } else if (isTooLarge) {
        return { warning: { type: DownloadWarningType.TooLargeFile } }
    }
}

async function getNftDownloadData(nft: INft): Promise<Partial<DownloadMetadata>> {
    const persistedNftData = get(persistedNftForActiveProfile)?.[nft.id]
    const shouldFetch =
        !persistedNftData?.downloadMetadata ||
        persistedNftData.downloadMetadata.error?.type === DownloadErrorType.NotReachable

    if (shouldFetch) {
        let downloadUrl = nft.composedUrl

        let response = await fetchWithTimeout(downloadUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
            method: 'HEAD',
            cache: 'force-cache',
        })
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
