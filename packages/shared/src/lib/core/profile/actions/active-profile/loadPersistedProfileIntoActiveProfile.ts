import { setActiveProfile } from '@core/profile/actions'
import { profiles } from '@core/profile/stores'
import { get } from 'svelte/store'

export function loadPersistedProfileIntoActiveProfile(profileId: string): void {
    const persistedProfile = get(profiles).find((_persistedProfile) => _persistedProfile.id === profileId)
    if (persistedProfile) {
        setActiveProfile(persistedProfile)
    }
}
