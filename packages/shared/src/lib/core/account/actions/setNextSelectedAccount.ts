import { setSelectedAccount } from '@core/account/actions'
import { getSelectedAccount } from '@core/account/stores'
import { nonHiddenActiveAccounts } from '@core/profile/stores'
import { get } from 'svelte/store'

export function setNextSelectedAccount(): void {
    const account = getSelectedAccount()
    if (!account?.hidden) {
        return
    }
    const otherAccounts = get(nonHiddenActiveAccounts)
    if (otherAccounts.length === 0) {
        throw new Error('No accounts to select from')
    }
    const nextSelectedAccountIndex =
        otherAccounts[account?.index]?.index ?? otherAccounts[otherAccounts?.length - 1]?.index
    setSelectedAccount(nextSelectedAccountIndex)
}
