import { get, writable } from 'svelte/store'
import { AsyncData, BaseStardustActivity, Activity, EvmActivity, BaseEvmActivity } from '../types'
import { NetworkNamespace } from '@core/network'

export const allAccountActivities = writable<{ [accountIndex: number]: Activity[] }>({})

export function addEmptyAccountActivities(accountIndex: number): void {
    setAccountActivities(accountIndex, [])
}

export function addAccountActivity(accountIndex: number, activity: Activity): void {
    allAccountActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        state[accountIndex].push(activity)
        return state
    })
}

export function addAccountActivities(accountIndex: number, activities: Activity[]): void {
    allAccountActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        state[accountIndex].push(...activities)
        return state
    })
}

export function setAccountActivities(accountIndex: number, accountActivities: Activity[]): void {
    allAccountActivities.update((state) => {
        state[accountIndex] = accountActivities
        return state
    })
}

export function getActivityByTransactionId(accountIndex: number, transactionId: string): Activity | undefined {
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

        if (activity?.namespace === NetworkNamespace.Stardust) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
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

        if (activity?.namespace === NetworkNamespace.Stardust) {
            Object.assign(activity, { asyncData: { ...activity.asyncData, ...partialAsyncData } })
        }
        return state
    })
}

export function updateEvmActivity(
    accountIndex: number,
    transactionHash: string,
    partialActivity: Partial<BaseEvmActivity>
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find(
            (_activity) => _activity.namespace === NetworkNamespace.Evm && _activity?.transactionId === transactionHash
        ) as EvmActivity

        if (!activity) {
            return state
        }

        Object.assign(activity, partialActivity)
        return state
    })
}

export function clearAccountActivities(): void {
    allAccountActivities.set({})
}

export function updateAccountActivitiesInAllAccountActivities(accountActivitiesToUpdate: {
    [accountIndex: number]: Activity[]
}): void {
    allAccountActivities.update((state) => {
        for (const _accountIndex of Object.keys(accountActivitiesToUpdate)) {
            const accountIndex = parseInt(_accountIndex)
            for (const activity of accountActivitiesToUpdate[accountIndex]) {
                const index = state[accountIndex].findIndex((_activity) => _activity.id === activity.id)
                state[accountIndex][index] = activity
            }
        }
        return state
    })
}
