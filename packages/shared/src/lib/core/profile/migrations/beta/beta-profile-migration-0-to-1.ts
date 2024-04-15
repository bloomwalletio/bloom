import { AppStage } from '@core/app/enums'
import {
    DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
    DownloadPermission,
    IPFS_GATEWAYS,
} from '@core/nfts'
import { IPersistedProfile } from '@core/profile/interfaces'

export function betaProfileMigration0To1(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        settings: { maxMediaSizeInMegaBytes?: number; maxMediaDownloadTimeInSeconds?: number }
    }
    profile.versionTrack = AppStage.BETA
    profile.settings.nfts = {
        ipfsGateway: IPFS_GATEWAYS[0],
        downloadPermissions: DownloadPermission.AllowListOnly,
        maxMediaSizeInMegaBytes: profile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds:
            profile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }
    return Promise.resolve()
}
