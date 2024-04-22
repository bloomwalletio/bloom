import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts/constants'
import { DownloadPermission } from '@core/nfts/enums'
import { DEFAULT_IPFS_GATEWAYS } from '@core/profile/constants'

type OldNftSettings = {
    ipfsGateway: string
    downloadPermissions: DownloadPermission
    maxMediaSizeInMegaBytes: number
    maxMediaDownloadTimeInSeconds: number
}

export function alphaProfileMigration12To13(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as {
        settings: { maxMediaSizeInMegaBytes?: number; maxMediaDownloadTimeInSeconds?: number; nfts: OldNftSettings }
    }
    profile.settings.nfts = {
        ipfsGateway: DEFAULT_IPFS_GATEWAYS[0].url,
        downloadPermissions: DownloadPermission.AllowListOnly,
        maxMediaSizeInMegaBytes: profile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds:
            profile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    } as OldNftSettings

    delete profile.settings.maxMediaSizeInMegaBytes
    delete profile.settings.maxMediaDownloadTimeInSeconds

    return Promise.resolve()
}
