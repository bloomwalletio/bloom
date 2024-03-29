import { IAccountState } from '@core/account/interfaces'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '@core/layer-2'
import { EvmNetworkId } from '@core/network'
import { NetworkId } from '@core/network/types'
import { hasTokenBeenUntracked } from '@core/wallet/actions'
import { addAccountActivity, addPersistedTokenBalanceChange, getBalanceChanges } from '../stores'
import { ITokenBalanceChange } from '../types'
import { generateEvmTokenBalanceChangeActivity } from '../utils'

export function calculateAndAddPersistedTokenBalanceChange(
    profileId: string,
    account: IAccountState,
    networkId: NetworkId,
    tokenId: string,
    newBalanceBigInt: bigint,
    hidden: boolean = false
): void {
    const newBalance = newBalanceBigInt.toString() || '0'

    const balanceChangesForAsset = getBalanceChanges(profileId, account.index, networkId)?.tokens?.[tokenId]
    const oldBalance = String(balanceChangesForAsset?.at(-1)?.newBalance ?? 0)

    if (oldBalance === newBalance) {
        return
    }

    const newBalanceChange: ITokenBalanceChange = {
        changedAt: Date.now(),
        oldBalance,
        newBalance,
        hidden,
    }

    const hasZeroStartingBalance = newBalanceChange.newBalance === '0' && newBalanceChange.oldBalance === undefined
    const isShimmerErc20Token = tokenId === BASE_TOKEN_CONTRACT_ADDRESS[networkId as EvmNetworkId]
    if (!hidden && !hasZeroStartingBalance && !hasTokenBeenUntracked(tokenId, networkId) && !isShimmerErc20Token) {
        const activity = generateEvmTokenBalanceChangeActivity(networkId, tokenId, newBalanceChange, account)
        addAccountActivity(account.index, activity)
    }
    addPersistedTokenBalanceChange(profileId, account.index, networkId, tokenId, newBalanceChange)
}
