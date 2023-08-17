import {
    addPersistedBalanceChange,
    getBalanceChanges,
    addActivityToAccountActivitiesInAllAccountActivities,
} from '../stores'
import { generateBalanceChangeActivity } from '../utils/generateBalanceChangeActivity'
import { ITokenBalanceChange } from '../types'

export function calculateAndAddPersistedBalanceChange(
    accountIndex: number,
    chainId: string | number,
    tokenId: string,
    newBalance: number
): void {
    newBalance = newBalance || 0

    const balanceChangesForAsset = getBalanceChanges(accountIndex, chainId)?.[tokenId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (!lastBalanceChange || lastBalanceChange.newBalance !== newBalance) {
        const newBalanceChange: ITokenBalanceChange = {
            changedAt: Date.now(),
            oldBalance: lastBalanceChange?.newBalance,
            newBalance,
        }

        const activity = generateBalanceChangeActivity(Number(chainId), tokenId, newBalanceChange)
        addActivityToAccountActivitiesInAllAccountActivities(accountIndex, activity)
        addPersistedBalanceChange(accountIndex, chainId, tokenId, newBalanceChange)
    }
}
