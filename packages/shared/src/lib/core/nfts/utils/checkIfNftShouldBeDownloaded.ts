import { Platform } from '@core/app/classes'
import features from '@features/features'
import { StatusCodes } from 'http-status-codes'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadPermission, DownloadWarningType } from '../enums'
import { IDownloadMetadata, Nft } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'
import { IError } from '@core/error/interfaces'
import { getActiveProfile } from '@core/profile/stores'
import { isValidNftUri } from './isValidNftUri'
import { getPrimaryNftUrl } from './getPrimaryNftUrl'

export async function checkIfNftShouldBeDownloaded(
    nft: Nft,
    skipDownloadSettingsCheck: boolean = false
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

        if (nft.isScam) {
            downloadMetadata.warning = { type: DownloadWarningType.ScamNft }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        if (!isValidNftUri(nft.mediaUrl)) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        if (!skipDownloadSettingsCheck) {
            const nftSettings = getActiveProfile()?.settings?.nfts ?? {}
            // TODO: Implement deny list
            switch (nftSettings.downloadPermissions) {
                case DownloadPermission.None:
                    downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                    return { shouldDownload: false, isLoaded: false, downloadMetadata }
                case DownloadPermission.AllowListOnly: {
                    const knownGateways = nftSettings.ipfsGateways.map((gateway) => gateway.url)
                    // TODO: move this to external allow list that we bull in at the same time as the deny list
                    const allowList = ['https://tideprotocol.infura-ipfs.io', ...knownGateways]
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
                    downloadUrl: getPrimaryNftUrl(nft.mediaUrl),
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
