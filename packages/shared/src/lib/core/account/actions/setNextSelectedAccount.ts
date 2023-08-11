import { setSelectedAccount } from '@core/account/actions'
import { selectedAccount } from '@core/account/stores'
import { nonHiddenActiveAccounts } from '@core/profile/stores'
import { get } from 'svelte/store'

export function setNextSelectedAccount(): void {
    const account = get(selectedAccount)
    const otherAccounts = get(nonHiddenActiveAccounts)
    if (otherAccounts.length > 0) {
        if (account?.hidden) {
            const nextSelectedAccountIndex =
                otherAccounts[account?.index]?.index ?? otherAccounts[otherAccounts?.length - 1]?.index
            setSelectedAccount(nextSelectedAccountIndex)
        }
    } else {
        throw new Error('No accounts to select from')
    }
}
