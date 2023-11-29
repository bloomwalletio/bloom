import { loadPersistedProfileIntoActiveProfile } from '@core/profile/actions'
import { addNewPersistedProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { convertOnboardingProfileToPersistedProfile } from '../helpers'
import { onboardingProfile } from '../stores'

export function createNewProfileFromOnboardingProfile(): void {
    const _onboardingProfile = get(onboardingProfile)
    const newProfile = convertOnboardingProfileToPersistedProfile(_onboardingProfile)
    addNewPersistedProfile(newProfile)
    loadPersistedProfileIntoActiveProfile(_onboardingProfile?.id)
}
