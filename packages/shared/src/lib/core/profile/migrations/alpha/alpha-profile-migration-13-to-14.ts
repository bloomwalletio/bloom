import { DEFAULT_IPFS_GATEWAYS } from '@core/profile/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration13To14(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.settings.nfts = {
        ...profile.settings.nfts,
        ipfsGateways: DEFAULT_IPFS_GATEWAYS,
    }

    return Promise.resolve()
}
