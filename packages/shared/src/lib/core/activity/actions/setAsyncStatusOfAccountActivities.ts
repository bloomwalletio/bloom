import { syncBalance } from '@core/account/actions/syncBalance'
import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { refreshAccountTokensForActiveProfile } from '@core/token/actions'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { getAsyncStatus } from '../utils/helper'

export function setAsyncStatusOfAccountActivities(time: Date): void {
    const balancesToUpdate: number[] = []
    allAccountActivities.update((state) => {
        state.forEach((accountActivities, accountIndex) => {
            for (const activity of accountActivities.filter((_activity) => _activity.asyncData)) {
                const oldAsyncStatus = activity.asyncData.asyncStatus
                if (oldAsyncStatus === ActivityAsyncStatus.Claimed || oldAsyncStatus === ActivityAsyncStatus.Expired) {
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
                        activity.type === ActivityType.Nft &&
                        activity.asyncData.asyncStatus === ActivityAsyncStatus.Expired &&
                        activity.direction === ActivityDirection.Outgoing
                    ) {
                        updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable: true })
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
        void refreshAccountTokensForActiveProfile()
    }
}
