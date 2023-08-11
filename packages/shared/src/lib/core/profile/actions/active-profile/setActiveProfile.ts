import { Platform } from '@core/app'
import { INITIAL_ACTIVE_PROFILE, IPersistedProfile, IProfile } from '@core/profile'
import { activeProfile, activeProfileId } from '@core/profile/stores'

export function setActiveProfile(persistedProfile: IPersistedProfile): void {
    activeProfile?.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, ...persistedProfile })
    activeProfileId?.set(persistedProfile.id)
    Platform.updateActiveProfile(persistedProfile.id)
}
