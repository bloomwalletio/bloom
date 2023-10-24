import {
    addPersistedTokenBalanceChange,
    getBalanceChanges,
    addActivityToAccountActivitiesInAllAccountActivities,
} from '../stores'
import { generateBalanceChangeActivity } from '../utils/generateBalanceChangeActivity'
import { ITokenBalanceChange } from '../types'
import { NetworkId } from '@core/network'
import { IAccountState } from '@core/account'

export async function calculateAndAddPersistedTokenBalanceChange(
    account: IAccountState,
    networkId: NetworkId,
    tokenId: string,
    newBalance: number,
    hidden: boolean = false
): Promise<void> {
    newBalance = newBalance || 0

    const balanceChangesForAsset = getBalanceChanges(account.index, networkId)?.tokens?.[tokenId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (lastBalanceChange?.newBalance === newBalance) {
        return
    }

    const newBalanceChange: ITokenBalanceChange = {
        changedAt: Date.now(),
        oldBalance: lastBalanceChange?.newBalance,
        newBalance: Math.floor(newBalance),
        hidden,
    }

    const hasZeroStartingBalance = newBalanceChange.newBalance === 0 && newBalanceChange.oldBalance === undefined
    if (!hidden && !hasZeroStartingBalance) {
        const activity = await generateBalanceChangeActivity(networkId, tokenId, newBalanceChange, account)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
    }
    addPersistedTokenBalanceChange(account.index, networkId, tokenId, newBalanceChange)
}
