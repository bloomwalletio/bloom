import { IAccountState } from '@core/account'
import { EvmNetworkId } from '@core/network'
import { addAccountActivity, addPersistedNftBalanceChange, getBalanceChanges } from '../stores'
import { INftBalanceChange } from '../types'
import { generateEvmNftBalanceChangeActivity } from '../utils'

export function calculateAndAddPersistedNftBalanceChange(
    profileId: string,
    account: IAccountState,
    networkId: EvmNetworkId,
    nftId: string,
    owned: boolean,
    hidden: boolean = false
): void {
    const balanceChangesForAsset = getBalanceChanges(profileId, account.index, networkId)?.nfts?.[nftId]
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
        const activity = generateEvmNftBalanceChangeActivity(networkId, nftId, newBalanceChange, account)
        addAccountActivity(account.index, activity)
    }
    addPersistedNftBalanceChange(profileId, account.index, networkId, nftId, newBalanceChange)
}
