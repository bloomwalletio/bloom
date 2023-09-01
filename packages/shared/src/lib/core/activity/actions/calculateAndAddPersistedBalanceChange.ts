import {
    addPersistedBalanceChange,
    getBalanceChanges,
    addActivityToAccountActivitiesInAllAccountActivities,
} from '../stores'
import { generateBalanceChangeActivity } from '../utils/generateBalanceChangeActivity'
import { ITokenBalanceChange } from '../types'
import { NetworkId } from '@core/network'

export function calculateAndAddPersistedBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string,
    newBalance: number,
    hidden: boolean = false
): void {
    newBalance = newBalance || 0

    const balanceChangesForAsset = getBalanceChanges(accountIndex, networkId)?.[tokenId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (!lastBalanceChange || lastBalanceChange.newBalance !== newBalance) {
        const newBalanceChange: ITokenBalanceChange = {
            changedAt: Date.now(),
            oldBalance: lastBalanceChange?.newBalance,
            newBalance,
            hidden,
        }

        if (!hidden) {
            const activity = generateBalanceChangeActivity(networkId, tokenId, newBalanceChange)
            addActivityToAccountActivitiesInAllAccountActivities(accountIndex, activity)
        }
        addPersistedBalanceChange(accountIndex, networkId, tokenId, newBalanceChange)
    }
}
