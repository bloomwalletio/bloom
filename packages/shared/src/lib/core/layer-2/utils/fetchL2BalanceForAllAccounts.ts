import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { checkForUntrackedTokens, fetchL2BalanceForAccount } from '../actions'

export function fetchL2BalanceForAllAccounts(addPreviouslyUntracked?: boolean): void {
    for (const account of get(activeAccounts)) {
        try {
            checkForUntrackedTokens(account, addPreviouslyUntracked)
            fetchL2BalanceForAccount(account)
        } catch (err) {
            console.error(err)
        }
    }
}
