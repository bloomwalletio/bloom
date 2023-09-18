import { get } from 'svelte/store'
import { loadPersistedProfileIntoActiveProfile } from '@core/profile/actions'
import { addNewProfile } from '@core/profile/stores'
import { convertOnboardingProfileToPersistedProfile } from '../helpers'
import { onboardingProfile } from '../stores'

export function createNewProfileFromOnboardingProfile(): void {
    const _onboardingProfile = get(onboardingProfile)
    const newProfile = convertOnboardingProfileToPersistedProfile(_onboardingProfile)
    addNewProfile(newProfile)
    loadPersistedProfileIntoActiveProfile(_onboardingProfile?.id)
}
