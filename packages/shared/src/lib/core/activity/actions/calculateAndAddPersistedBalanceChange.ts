import {
    addPersistedBalanceChange,
    getBalanceChanges,
    addActivityToAccountActivitiesInAllAccountActivities,
} from '../stores'
import { generateBalanceChangeActivity } from '../utils/generateBalanceChangeActivity'
import { IAssetBalanceChange } from '../types'

export function calculateAndAddPersistedBalanceChange(
    accountIndex: number,
    chainId: string | number,
    assetId: string,
    newBalance: number
): void {
    newBalance = newBalance || 0

    const balanceChangesForAsset = getBalanceChanges(accountIndex, chainId)?.[assetId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (!lastBalanceChange || lastBalanceChange.newBalance !== newBalance) {
        const newBalanceChange: IAssetBalanceChange = {
            changedAt: Date.now(),
            oldBalance: lastBalanceChange?.newBalance,
            newBalance,
        }

        const activity = generateBalanceChangeActivity(Number(chainId), assetId, newBalanceChange)
        addActivityToAccountActivitiesInAllAccountActivities(accountIndex, activity)
        addPersistedBalanceChange(accountIndex, chainId, assetId, newBalanceChange)
    }
}
