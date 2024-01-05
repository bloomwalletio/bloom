import { addPersistedTokenBalanceChange, getBalanceChanges, addAccountActivity } from '../stores'
import { generateTokenBalanceChangeActivity } from '../utils/evm'
import { ITokenBalanceChange } from '../types'
import { NetworkId } from '@core/network/types'
import { IAccountState } from '@core/account/interfaces'
import { hasTokenBeenUntracked } from '@core/wallet/actions'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '@core/layer-2'
import { EvmNetworkId } from '@core/network'

export async function calculateAndAddPersistedTokenBalanceChange(
    account: IAccountState,
    networkId: NetworkId,
    tokenId: string,
    newBalance: string,
    hidden: boolean = false
): Promise<void> {
    newBalance = newBalance || '0'

    const balanceChangesForAsset = getBalanceChanges(account.index, networkId)?.tokens?.[tokenId]
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
        const activity = await generateTokenBalanceChangeActivity(networkId, tokenId, newBalanceChange, account)
        addAccountActivity(account.index, activity)
    }
    addPersistedTokenBalanceChange(account.index, networkId, tokenId, newBalanceChange)
}
