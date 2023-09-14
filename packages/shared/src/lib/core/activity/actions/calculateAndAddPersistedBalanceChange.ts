import {
    addPersistedBalanceChange,
    getBalanceChanges,
    addActivityToAccountActivitiesInAllAccountActivities,
} from '../stores'
import { generateBalanceChangeActivity } from '../utils/generateBalanceChangeActivity'
import { ITokenBalanceChange } from '../types'
import { NetworkId } from '@core/network'

export async function calculateAndAddPersistedBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string,
    newBalance: number,
    hidden: boolean = false
): Promise<void> {
    newBalance = newBalance || 0

    const balanceChangesForAsset = getBalanceChanges(accountIndex, networkId)?.[tokenId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (lastBalanceChange?.newBalance === newBalance) {
        return
    }

    const newBalanceChange: ITokenBalanceChange = {
        changedAt: Date.now(),
        oldBalance: lastBalanceChange?.newBalance,
        newBalance,
        hidden,
    }

    if (!hidden) {
        const activity = await generateBalanceChangeActivity(networkId, tokenId, newBalanceChange)
        addActivityToAccountActivitiesInAllAccountActivities(accountIndex, activity)
    }
    addPersistedBalanceChange(accountIndex, networkId, tokenId, newBalanceChange)
}
