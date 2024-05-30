import { persistent } from '@core/utils/store'

import { IPersistedProfile } from '../interfaces'
import { get } from 'svelte/store'

export const profiles = persistent<IPersistedProfile[]>('profiles', [])

export function getPersistedProfile(profileId: string): IPersistedProfile | undefined {
    return get(profiles).find((profile) => profile.id === profileId)
}

/**
 * Adds a new profile to persistent storage
 * @method addNewProfile
 * @param {IPersistedProfile} persistedProfile
 * @returns {void}
 */
export function addNewPersistedProfile(persistedProfile: IPersistedProfile): void {
    profiles.update((state) => [...state, persistedProfile])
}

/**
 * Saves profile in persistent storage
 * @method saveProfile
 * @param {IPersistedProfile} persistedProfile
 * @returns {void}
 */
export function savePersistedProfile(persistedProfile: IPersistedProfile): void {
    profiles.update((state) => {
        return state.map((profile) => (profile.id === persistedProfile.id ? persistedProfile : profile))
    })
}

/**
 * Updates profile in persistent storage
 * @method updateProfile
 * @param {IPersistedProfile} partialPersistedProfile
 * @returns {void}
 */
export function updatePersistedProfile(profileId: string, partialPersistedProfile: Partial<IPersistedProfile>): void {
    profiles.update((state) =>
        state.map((profile) => {
            if (profile.id === profileId) {
                return { ...profile, ...partialPersistedProfile }
            } else {
                return profile
            }
        })
    )
}

/**
 * Removes a profile from persistent storage
 *
 * @method removeProfile
 * @param {string} profileId
 * @returns {void}
 */
export const removePersistedProfile = (profileId: string): void => {
    profiles.update((state) => state.filter((profile) => profile.id !== profileId))
}
