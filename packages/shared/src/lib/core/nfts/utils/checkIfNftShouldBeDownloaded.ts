import { Platform } from '@core/app/classes'
import { activeProfile, getActiveProfile } from '@core/profile/stores'
import { BYTES_PER_MEGABYTE, HttpHeader } from '@core/utils'
import features from '@features/features'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadWarningType, MimeType } from '../enums'
import { IIrc27Nft, Nft, IDownloadMetadata } from '../interfaces'
import { persistedNftForActiveProfile, updatePersistedNft } from '../stores'
import { PersistedNft } from '../types'
import { fetchWithTimeout } from './fetchWithTimeout'
import { isIrc27Nft } from '@core/nfts/utils/isIrc27Nft'

const HEAD_FETCH_TIMEOUT_SECONDS = 3
const UNREACHABLE_ERROR_MESSAGE = 'The user aborted a request.'

export async function checkIfNftShouldBeDownloaded(
    nft: Nft
): Promise<{ shouldDownload: boolean; downloadMetadata?: IDownloadMetadata; downloadUrl?: string }> {
    let downloadMetadata: IDownloadMetadata = nft.downloadMetadata ?? {}

    try {
        const alreadyDownloaded = features?.collectibles?.useCaching?.enabled && downloadMetadata.filePath
            ? await Platform.checkIfFileExists(`${downloadMetadata.filePath}/${NFT_MEDIA_FILE_NAME}`)
            : false
        console.log('already downloaded', downloadMetadata.filePath)
        if (alreadyDownloaded) {
            return {
                shouldDownload: false,
                downloadMetadata: {
                    ...downloadMetadata,
                    isLoaded: true,
                    error: undefined,
                    warning: undefined,
                }
            }
        } else if (!nft.composedUrl) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            downloadMetadata.isLoaded = false
            return { shouldDownload: false, downloadMetadata}
        } else {
            const nftData = await getNftDownloadData(nft)

            if (!get(persistedNftForActiveProfile)?.[nft.id]) {
                updatePersistedNft(nft.id, nftData)
            }

            const { contentType, contentLength, responseCode, downloadUrl } = nftData
            downloadMetadata = { ...downloadMetadata, contentLength, contentType, responseCode, downloadUrl, filePath: `${getActiveProfile().id}/nfts/${nft.id}` }

            const validation = validateFile(nft, contentType, contentLength)
            if (validation?.error || validation?.warning) {
                downloadMetadata = { ...downloadMetadata, ...validation }
                downloadMetadata.isLoaded = false
                return { shouldDownload: false, downloadMetadata }
            } else {
                downloadMetadata = {
                    ...downloadMetadata,
                    isLoaded: false,
                    error: undefined,
                    warning: undefined
                }
                if (features.collectibles.useCaching.enabled) {
                    return { shouldDownload: true, downloadMetadata }
                } else {
                    return { shouldDownload: false, downloadMetadata }
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

function validateFile(nft: Nft, contentType: string | undefined, contentLength: string | undefined): Partial<IDownloadMetadata> | undefined {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType = isIrc27Nft(nft) ? contentType === String(nft.metadata?.type) : true
    const isTooLarge = MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
    if (!isValidMediaType) {
        return { error: { type: DownloadErrorType.NotMatchingFileTypes } }
    } else if (isTooLarge) {
        return { warning: { type: DownloadWarningType.TooLargeFile } }
    }
}

async function getNftDownloadData(nft: Nft): Promise<Partial<PersistedNft>> {
    const persistedNftData = get(persistedNftForActiveProfile)?.[nft.id]

    if (persistedNftData && persistedNftData.error?.message !== UNREACHABLE_ERROR_MESSAGE) {
        if (persistedNftData.error) {
            throw persistedNftData.error
        }
        return persistedNftData
    } else {
        let downloadUrl = nft.composedUrl
        console.log('downloarUrld', downloadUrl)
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
            contentLength: headers.get(HttpHeader.ContentLength) ?? undefined,
            contentType: headers.get(HttpHeader.ContentType) ?? undefined,
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
