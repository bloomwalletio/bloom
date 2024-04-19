import { IStardustNetworkMetadata, getDefaultStardustNetwork } from '@core/network'

export function alphaProfileMigration2To3(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { network: IStardustNetworkMetadata }
    profile.network = getDefaultStardustNetwork(profile.network.id)
    return Promise.resolve()
}
