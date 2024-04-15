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
import { composeUrlFromNftUri } from './composeUrlFromNftUri'

export async function checkIfNftShouldBeDownloaded(
    nft: Nft,
    forceDownload: boolean = false
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

        if (!composeUrlFromNftUri(nft.mediaUrl)) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        if (!forceDownload) {
            const nftSettings = getActiveProfile()?.settings?.nfts ?? {}
            // TODO: Implement deny list
            switch (nftSettings.downloadPermissions) {
                case DownloadPermission.None:
                    downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                    return { shouldDownload: false, isLoaded: false, downloadMetadata }
                case DownloadPermission.AllowListOnly: {
                    const allowList = IPFS_GATEWAYS
                    const startsWithAllowedGateways =
                        nft.mediaUrl?.startsWith('ipfs://') ||
                        allowList.some((gateway) => nft.mediaUrl?.startsWith(gateway))
                    if (!startsWithAllowedGateways) {
                        downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                        return { shouldDownload: false, isLoaded: false, downloadMetadata }
                    }
                    break
                }
                case DownloadPermission.AllExceptDenylist:
                case DownloadPermission.All:
                    break
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
                    downloadUrl: composeUrlFromNftUri(nft.mediaUrl),
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
