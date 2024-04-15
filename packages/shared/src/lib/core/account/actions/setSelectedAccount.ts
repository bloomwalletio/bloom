import { updateAccountForConnectedDapps } from '@auxiliary/wallet-connect/actions'
import { pollL2BalanceForAccount } from '@core/layer-2/actions/pollL2BalanceForAccount'
import { activeAccounts, getActiveProfileId, updateActiveProfile } from '@core/profile/stores'
import { clearFilters } from '@core/utils'
import { resetSendOptionIndex } from '@core/wallet/stores'
import { get } from 'svelte/store'
import { selectedAccountIndex } from '../stores'

export function setSelectedAccount(index: number): void {
    const activeProfileId = getActiveProfileId()
    const account = get(activeAccounts)?.find((_account) => _account.index === index)
    if (account) {
        selectedAccountIndex.set(index)
        updateAccountForConnectedDapps(account)
        updateActiveProfile({ lastUsedAccountIndex: index })
        clearFilters()
        pollL2BalanceForAccount(activeProfileId, account)
        resetSendOptionIndex()
    } else {
        throw new Error(`Account with ID ${index} cannot be found!`)
    }
}
