import {
    DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
    DownloadPermission,
} from '@core/nfts'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration11To12(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        settings: { maxMediaSizeInMegaBytes?: number; maxMediaDownloadTimeInSeconds?: number }
    }
    profile.settings.nfts = {
        downloadPermissions: DownloadPermission.AllowListOnly,
        maxMediaSizeInMegaBytes: profile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds:
            profile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }

    return Promise.resolve()
}
