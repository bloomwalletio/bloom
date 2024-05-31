import { setActiveProfile } from '@core/profile/actions'
import { getPersistedProfile } from '@core/profile/stores'

export function loadPersistedProfileIntoActiveProfile(profileId: string): void {
    const persistedProfile = getPersistedProfile(profileId)
    if (persistedProfile) {
        setActiveProfile(persistedProfile)
    }
}
