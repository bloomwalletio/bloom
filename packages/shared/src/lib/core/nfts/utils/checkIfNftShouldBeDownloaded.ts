import { Platform } from '@core/app/classes'
import { activeProfile } from '@core/profile/stores'
import { BYTES_PER_MEGABYTE, HttpHeader } from '@core/utils'
import features from '@features/features'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadWarningType, MimeType } from '../enums'
import { IIrc27Nft, INft, INftDownloadStatus } from '../interfaces'
import { persistedNftForActiveProfile, updatePersistedNft } from '../stores'
import { PersistedNft } from '../types'
import { fetchWithTimeout } from './fetchWithTimeout'
import { isIrc27Nft } from '@core/nfts/utils/isIrc27Nft'

const HEAD_FETCH_TIMEOUT_SECONDS = 3
const UNREACHABLE_ERROR_MESSAGE = 'The user aborted a request.'

export async function checkIfNftShouldBeDownloaded(
    nft: INft
): Promise<{ shouldDownload: boolean; downloadMetadata?: INftDownloadStatus; downloadUrl?: string }> {
    let downloadMetadata: INftDownloadStatus = { isLoaded: false }

    try {
        const alreadyDownloaded = features?.collectibles?.useCaching?.enabled
            ? await Platform.checkIfFileExists(`${nft.filePath}/${NFT_MEDIA_FILE_NAME}`)
            : false

        if (alreadyDownloaded) {
            downloadMetadata.isLoaded = true
        } else if (!nft.composedUrl) {
            downloadMetadata.isLoaded = true
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
        } else {
            const nftData = await getNftDownloadData(nft)

            if (!get(persistedNftForActiveProfile)?.[nft.id]) {
                updatePersistedNft(nft.id, nftData)
            }

            const { downloadUrl, contentType, contentLength } = nftData

            const validation = validateFile(nft, contentType, contentLength)
            if (validation?.error || validation?.warning) {
                downloadMetadata = { ...downloadMetadata, ...validation }
            } else {
                if (features.collectibles.useCaching.enabled) {
                    return { shouldDownload: true, downloadUrl, downloadMetadata: { isLoaded: false } }
                } else {
                    return { shouldDownload: false, downloadUrl, downloadMetadata: { isLoaded: true } }
                }
            }
        }
    } catch (err) {
        if (err?.message === UNREACHABLE_ERROR_MESSAGE) {
            downloadMetadata.error = { type: DownloadErrorType.NotReachable }
        } else {
            downloadMetadata.error = { type: DownloadErrorType.Generic, message: err.message }
        }

        updatePersistedNft(nft.id, { error: { message: err?.message } })
    }

    return { shouldDownload: false, downloadUrl: nft.composedUrl, downloadMetadata }
}

function validateFile(nft: INft, contentType: string, contentLength: string): Partial<INftDownloadStatus> | undefined {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType = isIrc27Nft(nft) ? contentType === nft.metadata?.type : true
    const isTooLarge = MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
    if (!isValidMediaType) {
        return { error: { type: DownloadErrorType.NotMatchingFileTypes } }
    } else if (isTooLarge) {
        return { warning: { type: DownloadWarningType.TooLargeFile } }
    }
}

async function getNftDownloadData(nft: INft): Promise<Partial<PersistedNft>> {
    const persistedNftData = get(persistedNftForActiveProfile)?.[nft.id]

    if (persistedNftData && persistedNftData.error?.message !== UNREACHABLE_ERROR_MESSAGE) {
        if (persistedNftData.error) {
            throw persistedNftData.error
        }
        return persistedNftData
    } else {
        let downloadUrl = nft.composedUrl

        const response = await fetchWithTimeout(downloadUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
            method: 'HEAD',
            cache: 'force-cache',
        })
        let headers = response.headers

        const isSoonaverse = isIrc27Nft(nft) && nft.metadata?.issuerName === 'Soonaverse'
        if (isSoonaverse) {
            const newUrlAndHeaders = await getUrlAndHeadersFromOldSoonaverseStructure(nft, headers)
            downloadUrl = newUrlAndHeaders?.url ?? downloadUrl
            headers = newUrlAndHeaders?.headers ?? headers
        }

        return {
            downloadUrl,
            contentLength: headers.get(HttpHeader.ContentLength),
            contentType: headers.get(HttpHeader.ContentType),
            responseCode: response.status,
        }
    }
}

async function getUrlAndHeadersFromOldSoonaverseStructure(
    nft: IIrc27Nft,
    headers: Headers
): Promise<{ url: string; headers: Headers } | undefined> {
    const isContentTypeEqualNftType = (headers.get(HttpHeader.ContentType) as MimeType) === nft.metadata?.type
    if (!isContentTypeEqualNftType) {
        const backupUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.metadata?.name)
        const backupResponse = await fetchWithTimeout(backupUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
            method: 'HEAD',
            cache: 'force-cache',
        })
        return { url: backupUrl, headers: backupResponse.headers }
    }
}
