import { activeAccounts, updateActiveAccount } from '@core/profile/stores/active-accounts.store'
import { derived, get, Readable } from 'svelte/store'
import type { IAccountState } from '../interfaces'
import { selectedAccountIndex } from '../stores'

export const selectedAccount: Readable<IAccountState | undefined> = derived(
    [selectedAccountIndex, activeAccounts],
    ([$selectedAccountIndex, $activeAccounts]) => {
        $activeAccounts?.find((account) => account.index === $selectedAccountIndex)
        return $activeAccounts?.find((account) => account.index === $selectedAccountIndex)
    }
)

export function getSelectedAccount(): IAccountState {
    const account = get(selectedAccount)
    if (!account) {
        throw new Error('Selected account is undefined!')
    }
    return account
}

export function updateSelectedAccount(payload: Partial<IAccountState>): void {
    updateActiveAccount(get(selectedAccountIndex), payload)
}
