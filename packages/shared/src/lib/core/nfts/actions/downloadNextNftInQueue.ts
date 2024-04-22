import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue, updatePersistedNft } from '../stores'
import { buildFilePath, fetchWithTimeout, getSanitizedNftUrls, isIrc27Nft } from '../utils'
import { activeProfile } from '@core/profile/stores'
import { BYTES_PER_MEGABYTE, HttpHeader, sleep } from '@core/utils'
import { IDownloadMetadata, Nft } from '../interfaces'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { DownloadErrorType, DownloadWarningType, NftStandard, ParentMimeType } from '../enums'
import { updateNftInAllAccountNfts } from './updateNftInAllAccountNfts'

const HEAD_FETCH_TIMEOUT_SECONDS = 10
const DELAY_AFTER_DOWNLOAD_ERROR = 2000

export async function downloadNextNftInQueue(): Promise<void> {
    const nextNftToDownload = get(nftDownloadQueue)?.[0]
    if (!nextNftToDownload) {
        return
    }

    if (get(downloadingNftId)) {
        return
    }

    const { nft, options } = nextNftToDownload
    downloadingNftId.set(nft.id)

    try {
        let downloadMetadata: IDownloadMetadata | undefined
        const downloadUrls = getSanitizedNftUrls(nft.mediaUrl)
        for (const downloadUrl of downloadUrls) {
            downloadMetadata = await checkHeadRequestForNftUrl(
                nft,
                downloadUrl,
                nft.downloadMetadata ?? {},
                isIrc27Nft(nft) && nft.metadata?.issuerName === 'Soonaverse',
                options.skipSizeCheck
            )
            if (downloadMetadata.error?.type !== DownloadErrorType.NotReachable) {
                break
            }
        }

        if (!downloadMetadata) {
            throw new Error('Invalid download metadata')
        }
        updatePersistedNft(nft.id, { downloadMetadata })
        updateNftInAllAccountNfts(nft.id, { downloadMetadata })

        if (
            !downloadMetadata?.downloadUrl ||
            !downloadMetadata?.filePath ||
            downloadMetadata.error ||
            downloadMetadata.warning
        ) {
            throw new Error('Invalid download metadata')
        }

        await Platform.downloadNft(downloadMetadata.downloadUrl, downloadMetadata.filePath, nft.id)
    } catch (err) {
        removeNftFromDownloadQueue(nft.id)
        downloadingNftId.set(undefined)
    }
}

async function checkHeadRequestForNftUrl(
    nft: Nft,
    downloadUrl: string,
    downloadMetadata: IDownloadMetadata,
    shouldCheckSoonaverseFallback: boolean,
    skipSizeCheck: boolean
): Promise<IDownloadMetadata> {
    try {
        const response = await headRequest(downloadUrl)
        const updatedDownloadMetadata = { ...downloadMetadata, ...buildDownloadDataFromResponse(response) }

        if (updatedDownloadMetadata.responseCode === StatusCodes.OK) {
            return setReturnForOkResponse(
                nft,
                downloadUrl,
                updatedDownloadMetadata,
                shouldCheckSoonaverseFallback,
                skipSizeCheck
            )
        } else {
            return updatedDownloadMetadata
        }
    } catch (error) {
        await sleep(DELAY_AFTER_DOWNLOAD_ERROR)
        return {
            ...downloadMetadata,
            error: {
                type: DownloadErrorType.NotReachable,
            },
        }
    }
}

async function setReturnForOkResponse(
    nft: Nft,
    downloadUrl: string,
    downloadMetadata: IDownloadMetadata,
    shouldCheckSoonaverseFallback: boolean,
    skipSizeCheck: boolean
): Promise<IDownloadMetadata> {
    if (!isExpectedContentType(nft, downloadMetadata)) {
        if (shouldCheckSoonaverseFallback) {
            downloadUrl = downloadUrl + '/' + encodeURIComponent(nft?.name)
            return checkHeadRequestForNftUrl(nft, downloadUrl, downloadMetadata, false, skipSizeCheck)
        }

        return {
            ...downloadMetadata,
            error: { type: DownloadErrorType.NotMatchingFileTypes },
        }
    }

    if (!isMediaSupported(downloadMetadata.contentType ?? '')) {
        return {
            ...downloadMetadata,
            warning: { type: DownloadWarningType.UnsupportedMediaType },
        }
    }

    if (!skipSizeCheck && isFileTooLarge(downloadMetadata.contentLength ?? '')) {
        return {
            ...downloadMetadata,
            warning: { type: DownloadWarningType.TooLargeFile },
        }
    }

    return {
        ...downloadMetadata,
        downloadUrl,
        filePath: buildFilePath(nft),
        error: undefined,
        warning: undefined,
    }
}

function buildDownloadDataFromResponse(response: Response): Partial<IDownloadMetadata> {
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

async function headRequest(url: string): Promise<Response> {
    return fetchWithTimeout(url, HEAD_FETCH_TIMEOUT_SECONDS, {
        method: 'HEAD',
        cache: 'force-cache',
    })
}

function isFileTooLarge(contentLength: string): boolean {
    const MAX_FILE_SIZE_IN_BYTES =
        (get(activeProfile)?.settings?.nfts.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE
    return MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
}

function isExpectedContentType(nft: Nft, downloadMetadata: IDownloadMetadata): boolean {
    if (!downloadMetadata.contentType) {
        return false
    }

    if (nft.standard === NftStandard.Erc721) {
        return true
    }

    return nft.metadata?.type ? downloadMetadata.contentType === String(nft.metadata.type) : false
}

function isMediaSupported(contentType: string): boolean {
    const supportedTypes = [ParentMimeType.Image, ParentMimeType.Video]
    const mediaType = contentType.split('/', 1)[0]
    return supportedTypes.some((supportedType) => String(supportedType) === mediaType)
}
