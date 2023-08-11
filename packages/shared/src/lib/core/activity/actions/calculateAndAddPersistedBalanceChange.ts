import {
    addPersistedBalanceChange,
    getBalanceChanges,
    addActivityToAccountActivitiesInAllAccountActivities,
} from '../stores'
import { generateBalanceChangeActivity } from '../utils/generateBalanceChangeActivity'
import { IAssetBalanceChange } from '../types'
import { NetworkIdType } from '@core/network'

export function calculateAndAddPersistedBalanceChange(
    accountIndex: number,
    networkId: NetworkIdType,
    assetId: string,
    newBalance: number
): void {
    newBalance = newBalance || 0

    const balanceChangesForAsset = getBalanceChanges(accountIndex, networkId)?.[assetId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (!lastBalanceChange || lastBalanceChange.newBalance !== newBalance) {
        const newBalanceChange: IAssetBalanceChange = {
            changedAt: Date.now(),
            oldBalance: lastBalanceChange?.newBalance,
            newBalance,
        }

        const activity = generateBalanceChangeActivity(networkId, assetId, newBalanceChange)
        addActivityToAccountActivitiesInAllAccountActivities(accountIndex, activity)
        addPersistedBalanceChange(accountIndex, networkId, assetId, newBalanceChange)
    }
}
