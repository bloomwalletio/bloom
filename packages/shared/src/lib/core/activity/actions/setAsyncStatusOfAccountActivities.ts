import { syncBalance } from '@core/account/actions/syncBalance'
import { loadTokensForAllAccountBalances } from '@core/token/actions'
import { StardustActivityAsyncStatus, ActivityDirection, StardustActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { getAsyncStatus } from '../utils/helper'
import { NetworkNamespace } from '@core/network'
import { StardustActivity } from '../types'
import { updateNftForAccount } from '@core/nfts/stores'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
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
                    if (!balancesToUpdate.includes(accountIndex)) {
                        balancesToUpdate.push(accountIndex)
                    }

                    if (
                        activity.type === StardustActivityType.Nft &&
                        activity.asyncData.asyncStatus === StardustActivityAsyncStatus.Expired &&
                        activity.direction === ActivityDirection.Outgoing
                    ) {
                        updateNftForAccount(accountIndex, { id: activity.nftId, isSpendable: true })
                    }
                }
            }
        })
        return state
    })
    for (const accountIndex of balancesToUpdate) {
        syncBalance(accountIndex)
    }
    if (balancesToUpdate.length) {
        void loadTokensForAllAccountBalances()
    }
}
