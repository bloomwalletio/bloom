import { syncBalance } from '@core/account/actions/syncBalance'
import { loadTokensForAllAccountBalances } from '@core/token/actions'
import { StardustActivityAsyncStatus, ActivityDirection, StardustActivityType } from '../enums'
import { allAccountActivities, updateAccountActivitiesInAllAccountActivities } from '../stores'
import { getAsyncStatus } from '../utils/helper'
import { NetworkNamespace } from '@core/network'
import { Activity, StardustActivity } from '../types'
import { updateNftForAccount } from '@core/nfts/stores'
import { get } from 'svelte/store'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const updatedAccountActivities: { [accountIndex: number]: Activity[] } = {}
    const accountsToUpdate: Set<number> = new Set()

    for (const _accountIndex of Object.keys(get(allAccountActivities))) {
        const accountIndex = parseInt(_accountIndex)
        const accountActivities = get(allAccountActivities)[accountIndex]

        const asyncActivities = accountActivities.filter(
            (_activity) => _activity.namespace === NetworkNamespace.Stardust && _activity.asyncData
        ) as StardustActivity[]

        for (const activity of asyncActivities) {
            if (!activity.asyncData) {
                continue
            }

            const oldAsyncStatus = activity.asyncData.asyncStatus
            if (
                oldAsyncStatus === StardustActivityAsyncStatus.Claimed ||
                oldAsyncStatus === StardustActivityAsyncStatus.Expired
            ) {
                continue
            }
            activity.asyncData.asyncStatus = getAsyncStatus(
                false,
                activity.asyncData.expirationDate,
                activity.asyncData.timelockDate,
                !!activity.storageDeposit,
                time.getTime()
            )
            if (oldAsyncStatus !== null && oldAsyncStatus !== activity.asyncData.asyncStatus) {
                if (!updatedAccountActivities[accountIndex]) {
                    updatedAccountActivities[accountIndex] = []
                }
                updatedAccountActivities[accountIndex].push(activity)
                accountsToUpdate.add(accountIndex)

                if (
                    activity.type === StardustActivityType.Nft &&
                    activity.asyncData.asyncStatus === StardustActivityAsyncStatus.Expired &&
                    activity.direction === ActivityDirection.Outgoing
                ) {
                    updateNftForAccount(accountIndex, { id: activity.nftId, isSpendable: true })
                }
            }
        }
    }

    if (Object.keys(updatedAccountActivities).length > 0) {
        updateAccountActivitiesInAllAccountActivities(updatedAccountActivities)
    }

    for (const accountIndex of accountsToUpdate) {
        syncBalance(accountIndex)
    }

    if (accountsToUpdate.size > 0) {
        void loadTokensForAllAccountBalances()
    }
}
