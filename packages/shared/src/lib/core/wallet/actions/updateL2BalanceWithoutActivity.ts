import { IAccountState } from '@core/account/interfaces'
import { calculateAndAddPersistedTokenBalanceChange } from '@core/activity/actions'
import { updateLayer2AccountBalanceForTokenOnChain } from '@core/layer-2/stores'
import { NetworkId } from '@core/network/types'

export async function updateL2BalanceWithoutActivity(
    rawAmount: bigint,
    tokenId: string,
    account: IAccountState,
    networkId: NetworkId
): Promise<void> {
    const newBalance = updateLayer2AccountBalanceForTokenOnChain(account.index, networkId, tokenId, rawAmount)
    await calculateAndAddPersistedTokenBalanceChange(account, networkId, tokenId, newBalance, true)
}
