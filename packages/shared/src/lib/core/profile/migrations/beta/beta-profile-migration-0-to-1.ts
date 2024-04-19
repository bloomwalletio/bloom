import { AppStage } from '@core/app/enums'
import {
    DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
    DownloadPermission,
} from '@core/nfts'
import { DEFAULT_IPFS_GATEWAYS } from '@core/profile/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function betaProfileMigration0To1(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        settings: { maxMediaSizeInMegaBytes?: number; maxMediaDownloadTimeInSeconds?: number }
    }
    profile.versionTrack = AppStage.BETA
    profile.settings.nfts = {
        ipfsGateways: DEFAULT_IPFS_GATEWAYS,
        downloadPermissions: DownloadPermission.AllowListOnly,
        maxMediaSizeInMegaBytes: profile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds:
            profile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }
    return Promise.resolve()
}
