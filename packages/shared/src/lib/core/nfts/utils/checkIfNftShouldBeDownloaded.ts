import { Platform } from '@core/app/classes'
import features from '@features/features'
import { StatusCodes } from 'http-status-codes'
import { get } from 'svelte/store'
import { NFT_MEDIA_FILE_NAME } from '../constants'
import { DownloadErrorType, DownloadPermission, DownloadWarningType, ParentMimeType } from '../enums'
import { IDownloadMetadata, Nft } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'
import { IError } from '@core/error/interfaces'
import { getActiveProfile } from '@core/profile/stores'
import { isValidNftUri } from './isValidNftUri'
import { getPrimaryNftUrl } from './getPrimaryNftUrl'
import { appParameters } from '@core/app/stores'

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

        if (!isMediaSupported(nft.metadata?.type || '')) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedMediaType }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        if (!nft.mediaUrl || !isValidNftUri(nft.mediaUrl)) {
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return { shouldDownload: false, isLoaded: false, downloadMetadata }
        }

        if (!skipDownloadSettingsCheck) {
            const nftSettings = getActiveProfile()?.settings?.nfts ?? {}
            switch (nftSettings.downloadPermissions) {
                case DownloadPermission.None:
                    downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                    return { shouldDownload: false, isLoaded: false, downloadMetadata }
                case DownloadPermission.AllowListOnly: {
                    const knownGateways = nftSettings.ipfsGateways.map((gateway) => gateway.url)
                    const remoteAllowlist = get(appParameters).allowlists.urls
                    const allowlist = [...remoteAllowlist, ...knownGateways]
                    const mediaUrl = new URL(nft.mediaUrl)
                    const startsWithAllowedGateway =
                        mediaUrl.protocol === 'ipfs:' ||
                        (mediaUrl.protocol === 'https:' &&
                            allowlist.some((allowedUrl) => {
                                const url = new URL(allowedUrl)
                                return mediaUrl.origin === url.origin
                            }))
                    if (!startsWithAllowedGateway) {
                        downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                        return { shouldDownload: false, isLoaded: false, downloadMetadata }
                    }
                    break
                }
                case DownloadPermission.AllExceptDenylist: {
                    const denylist = get(appParameters).denylists.urls
                    const mediaUrl = new URL(nft.mediaUrl)
                    const startsWithDeniedGateway = denylist.some((blockedUrl) => {
                        return mediaUrl.origin.includes(blockedUrl)
                    })
                    if (startsWithDeniedGateway) {
                        downloadMetadata.warning = { type: DownloadWarningType.DownloadNotAllowed }
                        return { shouldDownload: false, isLoaded: false, downloadMetadata }
                    }
                    break
                }
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

function isMediaSupported(contentType: string): boolean {
    const supportedTypes = [ParentMimeType.Image, ParentMimeType.Video]
    const mediaType = contentType.split('/', 1)[0]
    return supportedTypes.some((supportedType) => String(supportedType) === mediaType)
}
