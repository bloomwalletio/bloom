import { addPersistedNftBalanceChange, getBalanceChanges, addAccountActivity } from '../stores'
import { generateNftBalanceChangeActivity } from '../utils/evm'
import { INftBalanceChange } from '../types'
import { NetworkId } from '@core/network'
import { IAccountState } from '@core/account'

export function calculateAndAddPersistedNftBalanceChange(
    account: IAccountState,
    networkId: NetworkId,
    nftId: string,
    owned: boolean,
    hidden: boolean = false
): void {
    const balanceChangesForAsset = getBalanceChanges(account.index, networkId)?.nfts?.[nftId]
    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (lastBalanceChange?.owned === owned || (!lastBalanceChange && !owned)) {
        return
    }

    const newBalanceChange: INftBalanceChange = {
        changedAt: Date.now(),
        owned,
        hidden,
    }

    if (!hidden) {
        const activity = generateNftBalanceChangeActivity(networkId, nftId, newBalanceChange, account)
        addAccountActivity(account.index, activity)
    }
    addPersistedNftBalanceChange(account.index, networkId, nftId, newBalanceChange)
}
