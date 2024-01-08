import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue, updatePersistedNft } from '../stores'
import { buildFilePath, fetchWithTimeout, isIrc27Nft } from '../utils'
import { activeProfile } from '@core/profile/stores'
import { BYTES_PER_MEGABYTE, HttpHeader } from '@core/utils'
import { DownloadMetadata, INft } from '../interfaces'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { DownloadErrorType, DownloadWarningType } from '../enums'
import { updateNftInAllAccountNfts } from './updateNftInAllAccountNfts'

const HEAD_FETCH_TIMEOUT_SECONDS = 10

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
        const downloadMetadata = {
            ...(nextNftToDownload.downloadMetadata ?? {}),
            error: {
                type: DownloadErrorType.NotReachable,
            },
        }
        updatePersistedNft(nextNftToDownload.id, { downloadMetadata })
        updateNftInAllAccountNfts(nextNftToDownload.id, { downloadMetadata })

        console.error(err, nextNftToDownload.id)
        removeNftFromDownloadQueue(nextNftToDownload.id)
        downloadingNftId.set(undefined)
    }
}

async function checkHeadRequestForNftUrl(
    nft: INft,
    downloadMetadata: DownloadMetadata,
    shouldCheckSoonaverseFallback: boolean
): Promise<DownloadMetadata> {
    const response = await headRequest(nft.composedUrl)
    const updatedDownloadMetadata = { ...downloadMetadata, ...buildDownloadDataFromResponse(response) }

    if (updatedDownloadMetadata.responseCode === StatusCodes.OK) {
        return setReturnForOkResponse(nft, updatedDownloadMetadata, shouldCheckSoonaverseFallback)
    } else {
        return updatedDownloadMetadata
    }
}

async function setReturnForOkResponse(
    nft: INft,
    downloadMetadata: DownloadMetadata,
    shouldCheckSoonaverseFallback: boolean
): Promise<DownloadMetadata> {
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

function isExpectedContentType(nft: INft, downloadMetadata: DownloadMetadata): boolean {
    if (!nft.metadata?.type || !downloadMetadata.contentType) {
        return false
    }

    return downloadMetadata.contentType === String(nft.metadata.type)
}
