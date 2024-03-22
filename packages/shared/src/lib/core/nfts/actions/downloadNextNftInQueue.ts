import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue, updatePersistedNft } from '../stores'
import { buildFilePath, fetchWithTimeout, isIrc27Nft } from '../utils'
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
    downloadingNftId.set(nextNftToDownload.id)

    try {
        const downloadMetadata = await checkHeadRequestForNftUrl(
            nextNftToDownload,
            nextNftToDownload.downloadMetadata ?? {},
            isIrc27Nft(nextNftToDownload) && nextNftToDownload.metadata?.issuerName === 'Soonaverse'
        )
        updatePersistedNft(nextNftToDownload.id, { downloadMetadata })
        updateNftInAllAccountNfts(nextNftToDownload.id, { downloadMetadata })

        if (
            !downloadMetadata?.downloadUrl ||
            !downloadMetadata?.filePath ||
            downloadMetadata.error ||
            downloadMetadata.warning
        ) {
            throw new Error('Invalid download metadata')
        }

        await Platform.downloadNft(downloadMetadata.downloadUrl, downloadMetadata.filePath, nextNftToDownload.id)
    } catch (err) {
        removeNftFromDownloadQueue(nextNftToDownload.id)
        downloadingNftId.set(undefined)
    }
}

async function checkHeadRequestForNftUrl(
    nft: Nft,
    downloadMetadata: IDownloadMetadata,
    shouldCheckSoonaverseFallback: boolean
): Promise<IDownloadMetadata> {
    try {
        const response = await headRequest(nft.composedUrl ?? '')
        const updatedDownloadMetadata = { ...downloadMetadata, ...buildDownloadDataFromResponse(response) }

        if (updatedDownloadMetadata.responseCode === StatusCodes.OK) {
            return setReturnForOkResponse(nft, updatedDownloadMetadata, shouldCheckSoonaverseFallback)
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
    downloadMetadata: IDownloadMetadata,
    shouldCheckSoonaverseFallback: boolean
): Promise<IDownloadMetadata> {
    if (!isExpectedContentType(nft, downloadMetadata)) {
        if (shouldCheckSoonaverseFallback) {
            nft.composedUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.name)
            return checkHeadRequestForNftUrl(nft, downloadMetadata, false)
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

    if (isFileTooLarge(downloadMetadata.contentLength ?? '')) {
        return {
            ...downloadMetadata,
            warning: { type: DownloadWarningType.TooLargeFile },
        }
    }

    return {
        ...downloadMetadata,
        downloadUrl: nft.composedUrl,
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
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE
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
