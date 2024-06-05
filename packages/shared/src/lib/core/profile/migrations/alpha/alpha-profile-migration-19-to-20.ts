import { IPersistedProfile } from '@core/profile/interfaces'
import { addDefaultIscChainsToIotaProfiles } from '../actions/addDefaultIscChainsToIotaProfiles'

export function alphaProfileMigration19To20(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    addDefaultIscChainsToIotaProfiles(profile)

    return Promise.resolve()
}
