import { getActiveProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import type { IHiddenActivities } from '../types'

export const hiddenActivities = persistent<IHiddenActivities>('hiddenActivities', {})

export function isActivityHiddenForAccountIndex(accountIndex: number, activityId: string): boolean {
    const activities = get(hiddenActivities)?.[getActiveProfileId()]?.[accountIndex]
    return activities ? activities.includes(activityId) : false
}

export function removeActivityFromHiddenActivities(accountIndex: number, activityId: string): void {
    const activities = get(hiddenActivities)?.[getActiveProfileId()]?.[accountIndex]
    if (activities) {
        hiddenActivities.update((state) => {
            state[getActiveProfileId()][accountIndex] = activities.filter((id) => id !== activityId)
            return state
        })
    }
}

export function removeHiddenActivitiesForProfile(profileId: string): void {
    hiddenActivities.update((state) => {
        delete state[profileId]
        return state
    })
}
