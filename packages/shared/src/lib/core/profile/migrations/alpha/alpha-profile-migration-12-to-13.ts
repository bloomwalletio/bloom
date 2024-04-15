import {
    DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
    IPFS_GATEWAYS,
} from '@core/nfts/constants'
import { DownloadPermission } from '@core/nfts/enums'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration12To13(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        settings: { maxMediaSizeInMegaBytes?: number; maxMediaDownloadTimeInSeconds?: number }
    }
    profile.settings.nfts = {
        ipfsGateway: IPFS_GATEWAYS[0],
        downloadPermissions: DownloadPermission.AllowListOnly,
        maxMediaSizeInMegaBytes: profile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds:
            profile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }
    delete profile.settings.maxMediaSizeInMegaBytes
    delete profile.settings.maxMediaDownloadTimeInSeconds

    return Promise.resolve()
}
