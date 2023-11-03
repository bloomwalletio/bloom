import { IPersistedNetwork, getDefaultPersistedNetwork } from '@core/network'

export function alphaProfileMigration2To3(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { network: IPersistedNetwork }
    profile.network = getDefaultPersistedNetwork(profile.network.id)
    return Promise.resolve()
}
