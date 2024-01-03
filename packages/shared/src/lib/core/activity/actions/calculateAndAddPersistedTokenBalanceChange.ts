import { addPersistedTokenBalanceChange, getBalanceChanges, addAccountActivity } from '../stores'
import { generateTokenBalanceChangeActivity } from '../utils/evm'
import { ITokenBalanceChange } from '../types'
import { NetworkId } from '@core/network/types'
import { IAccountState } from '@core/account/interfaces'
import { hasTokenBeenUntracked } from '@core/wallet/actions'

export async function calculateAndAddPersistedTokenBalanceChange(
    account: IAccountState,
    networkId: NetworkId,
    tokenId: string,
    newBalance: bigint,
    hidden: boolean = false
): Promise<void> {
    newBalance = newBalance || BigInt(0)

    const balanceChangesForAsset = getBalanceChanges(account.index, networkId)?.tokens?.[tokenId]
    const oldBalance = BigInt(balanceChangesForAsset?.at(-1)?.newBalance ?? 0)

    if (oldBalance === newBalance) {
        return
    }

    const newBalanceChange: ITokenBalanceChange = {
        changedAt: Date.now(),
        oldBalance,
        newBalance,
        hidden,
    }

    const hasZeroStartingBalance =
        newBalanceChange.newBalance === BigInt(0) && newBalanceChange.oldBalance === undefined
    if (!hidden && !hasZeroStartingBalance && !hasTokenBeenUntracked(tokenId, networkId)) {
        const activity = await generateTokenBalanceChangeActivity(networkId, tokenId, newBalanceChange, account)
        addAccountActivity(account.index, activity)
    }
    addPersistedTokenBalanceChange(account.index, networkId, tokenId, newBalanceChange)
}
