import { get } from 'svelte/store'
import { Platform } from '@core/app'
import { INITIAL_ACTIVE_PROFILE, IProfile } from '@core/profile'
import { activeProfile, activeProfileId } from '@core/profile/stores'

export function resetActiveProfile(): void {
    const { lastUsedAccountIndex } = get(activeProfile)
    activeProfile.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, lastUsedAccountIndex })
    activeProfileId.set(null)
    Platform.updateActiveProfile(null)
}
