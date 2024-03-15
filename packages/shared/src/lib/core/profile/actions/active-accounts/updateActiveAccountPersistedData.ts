import { IPersistedAccountData } from '@core/account/interfaces'
import { selectedAccountIndex, updateSelectedAccount } from '@core/account/stores'
import { updateAccountPersistedDataOnActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function updateActiveAccountPersistedData(
    accountIndex: number | undefined,
    partialAccountPersistedData: Partial<IPersistedAccountData>
): void {
    if (accountIndex === undefined) {
        return
    }
    if (get(selectedAccountIndex) === accountIndex) {
        updateSelectedAccount(partialAccountPersistedData)
    }
    updateAccountPersistedDataOnActiveProfile(accountIndex, partialAccountPersistedData)
}
