import { get, writable } from 'svelte/store'
import { StardustActivity, AsyncData, BaseStardustActivity } from '../types'

export const allAccountActivities = writable<StardustActivity[][]>([])

export function addEmptyAccountActivities(accountIndex: number): void {
    setAccountActivities(accountIndex, [])
}

export function addAccountActivity(accountIndex: number, activity: StardustActivity): void {
    allAccountActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        state[accountIndex].push(activity)
        return state
    })
}

export function addAccountActivities(accountIndex: number, activities: StardustActivity[]): void {
    allAccountActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        state[accountIndex].push(...activities)
        return state
    })
}

export function setAccountActivities(accountIndex: number, accountActivities: StardustActivity[]): void {
    allAccountActivities.update((state) => {
        state[accountIndex] = accountActivities
        return state
    })
}

export function getActivityByTransactionId(accountIndex: number, transactionId: string): StardustActivity | undefined {
    return get(allAccountActivities)?.[accountIndex]?.find((_activity) => _activity?.transactionId === transactionId)
}

export function updateActivityByTransactionId(
    accountIndex: number,
    transactionId: string,
    partialBaseActivity: Partial<BaseStardustActivity>
): void {
    allAccountActivities.update((state) => {
        const activities = state[accountIndex]?.filter((_activity) => _activity?.transactionId === transactionId)

        activities.forEach((activity) => Object.assign(activity, partialBaseActivity))
        return state
    })
}

export function updateActivityByActivityId(
    accountIndex: number,
    activityId: string,
    partialBaseActivity: Partial<BaseStardustActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            Object.assign(activity, partialBaseActivity)
        }
        return state
    })
}

export function updateAsyncDataByActivityId(
    accountIndex: number,
    activityId: string,
    partialAsyncData: Partial<AsyncData>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity.id === activityId)

        if (activity) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}

export function updateAsyncDataByActivityIds(
    accountIndex: number,
    activityIds: string[],
    partialAsyncData: Partial<AsyncData>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.filter((_activity) => activityIds.includes(_activity.id))
        for (const _activity of activity) {
            Object.assign(_activity, { asyncData: { ..._activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}

export function updateAsyncDataByTransactionId(
    accountIndex: number,
    transactionId: string,
    partialAsyncData: Partial<AsyncData>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find((_activity) => _activity?.transactionId === transactionId)

        if (activity) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}

export function clearAccountActivities(): void {
    allAccountActivities.set([])
}
