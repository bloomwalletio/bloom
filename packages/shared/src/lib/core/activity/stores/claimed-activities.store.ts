import { getActiveProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { IClaimedActivities, IClaimedActivitiesPerProfile } from '../types'

export const claimedActivities = persistent<IClaimedActivitiesPerProfile>('claimedActivities', {})

export function addClaimedActivity(
    accountIndex: number,
    transactionId: string | undefined,
    claimedActivity: IClaimedActivities
): void {
    claimedActivities.update((state) => {
        const profileId = getActiveProfileId()
        if (Array.isArray(state)) {
            // needed because of legacy way to store claimed activities
            state = {}
        }
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {}
        }

        if (transactionId) {
            state[profileId][accountIndex][transactionId] = claimedActivity
        }
        return state
    })
}

export function removeClaimedActivitiesForProfile(profileId: string): void {
    claimedActivities.update((state) => {
        delete state[profileId]
        return state
    })
}
