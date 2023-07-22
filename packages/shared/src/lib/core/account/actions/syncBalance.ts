import { getBalance } from '../api/getBalance'
import { getSelectedAccount, updateSelectedAccount } from '../stores'
import { updateActiveAccount } from '@core/profile'

export async function syncBalance(accountIndex: number): Promise<void> {
    const balances = await getBalance(accountIndex)
    if (getSelectedAccount().index === accountIndex) {
        updateSelectedAccount({ balances })
    } else {
        updateActiveAccount(accountIndex, { balances })
    }
    return
}
