import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { fetchLayer2BalanceForAccount } from '../actions'

export function fetchL2BalanceForAllAccounts(): void {
    for (const account of get(activeAccounts)) {
        try {
            fetchLayer2BalanceForAccount(account)
        } catch (err) {
            console.error(err)
        }
    }
}
