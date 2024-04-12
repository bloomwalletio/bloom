import { Platform } from '@core/app/classes'
import features from '@features/features'
import { StatusCodes } from 'http-status-codes'
import { get } from 'svelte/store'
import { IPFS_GATEWAYS, NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadPermission, DownloadWarningType } from '../enums'
import { IDownloadMetadata, Nft } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'
import { IError } from '@core/error/interfaces'
import { getActiveProfile } from '@core/profile/stores'

export async function checkIfNftShouldBeDownloaded(
    nft: Nft
): Promise<{ shouldDownload: boolean; downloadMetadata: IDownloadMetadata; isLoaded: boolean }> {
    let downloadMetadata: IDownloadMetadata = nft.downloadMetadata ?? {}

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

        const nftSettings = getActiveProfile()?.settings?.nfts ?? {}

        // TODO: Implement deny list
        if (
            nftSettings.downloadPermissions === DownloadPermission.None ||
            nftSettings.downloadPermissions === DownloadPermission.AllExceptDenylist
        ) {
            downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        } else if (nftSettings.downloadPermissions === DownloadPermission.AllowListOnly) {
            // TODO: Implement allow list, currently only IPFS gateways are allowed
            const allowList = IPFS_GATEWAYS

            const startsWithAllowedGateways = allowList.some((gateway) => nft.composedUrl?.startsWith(gateway))
            if (!startsWithAllowedGateways) {
                downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                return { shouldDownload: false, isLoaded: false, downloadMetadata }
            }
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
        downloadMetadata = {
            ...downloadMetadata,
            error: { type: DownloadErrorType.Generic, message: (err as IError)?.message },
        }

        return { shouldDownload: false, isLoaded: false, downloadMetadata }
    }
}
