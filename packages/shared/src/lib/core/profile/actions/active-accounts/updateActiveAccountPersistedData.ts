import { get } from 'svelte/store'
import { IPersistedAccountData } from '@core/account/interfaces'
import { selectedAccountIndex, updateSelectedAccount } from '@core/account/stores'
import { updateAccountPersistedDataOnActiveProfile } from '@core/profile/stores'

export function updateActiveAccountPersistedData(
    acccountIndex: number,
    partialAccountPersistedData: Partial<IPersistedAccountData>
): void {
    if (get(selectedAccountIndex) === acccountIndex) {
        updateSelectedAccount(partialAccountPersistedData)
    }
    updateAccountPersistedDataOnActiveProfile(acccountIndex, partialAccountPersistedData)
}
