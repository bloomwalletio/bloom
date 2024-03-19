import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'

export const activeProfileId = persistent<string | null>('activeProfileId', null)

export function getActiveProfileId(): string {
    const profileId = get(activeProfileId)
    if (!profileId) {
        throw new Error('No active profile ID set!')
    }
    return profileId
}
