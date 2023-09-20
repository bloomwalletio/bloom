import { IAccountState } from '@core/account/interfaces'
import { calculateAndAddPersistedBalanceChange } from '@core/activity/actions'
import { updateLayer2AccountBalanceForTokenOnChain } from '@core/layer-2/stores'
import { NetworkId } from '@core/network/types'

export async function updateL2BalanceWithoutActivity(
    rawAmount: number,
    tokenId: string,
    account: IAccountState,
    networkId: NetworkId
): Promise<void> {
    const delta = rawAmount * -1
    const newBalance = updateLayer2AccountBalanceForTokenOnChain(account.index, networkId, tokenId, delta)
    await calculateAndAddPersistedBalanceChange(account.index, networkId, tokenId, newBalance, true)
}
