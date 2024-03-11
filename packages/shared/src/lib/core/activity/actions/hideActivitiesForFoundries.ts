import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { StardustActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { updateActivityFromPartialActivity } from '../utils'
import { NetworkNamespace } from '@core/network'
import { StardustActivity } from '../types'

export function hideActivitiesForFoundries(account: IAccountState): void {
    const accountActivities = get(allAccountActivities)[account.index]

    const activities = accountActivities.filter(
        (activity) => activity.namespace === NetworkNamespace.Stardust && activity.type === StardustActivityType.Foundry
    ) as StardustActivity[]

    for (const activity of activities) {
        const candidates = accountActivities.filter(
            (_activity) =>
                _activity.namespace === NetworkNamespace.Stardust &&
                _activity?.transactionId === activity.transactionId &&
                _activity.id !== activity.id
        ) as StardustActivity[]

        for (const candidate of candidates) {
            updateActivityFromPartialActivity(candidate, { isHidden: true })
        }
    }
}
