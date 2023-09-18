import { get } from 'svelte/store'
import { setActiveProfile } from '@core/profile/actions'
import { profiles } from '@core/profile/stores'

export function loadPersistedProfileIntoActiveProfile(profileId: string): void {
    const persistedProfile = get(profiles).find((_persistedProfile) => _persistedProfile.id === profileId)
    if (persistedProfile) {
        setActiveProfile(persistedProfile)
    }
}
