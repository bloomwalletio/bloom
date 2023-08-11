import { updateActiveAccount } from '@core/profile/stores/active-accounts.store'
import { get } from 'svelte/store'
import { getBalance } from '../api/getBalance'
import { selectedAccount, updateSelectedAccount } from '../stores/selected-account.store'

export async function syncBalance(accountIndex: number): Promise<void> {
    const balances = await getBalance(accountIndex)
    if (get(selectedAccount)?.index === accountIndex) {
        updateSelectedAccount({ balances })
    } else {
        updateActiveAccount(accountIndex, { balances })
    }
    return
}
