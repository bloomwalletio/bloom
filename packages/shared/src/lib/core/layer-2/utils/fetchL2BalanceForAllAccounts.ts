import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { checkForUntrackedTokens, fetchL2BalanceForAccount } from '../actions'
import { checkForUntrackedNfts } from '@core/nfts/actions'

export function fetchL2BalanceForAllAccounts(addPreviouslyUntracked?: boolean): void {
    console.log('fetchL2BalanceForAllAccounts')
    for (const account of get(activeAccounts)) {
        try {
            checkForUntrackedTokens(account, addPreviouslyUntracked)
            void checkForUntrackedNfts(account)
            fetchL2BalanceForAccount(account)
        } catch (err) {
            console.error(err)
        }
    }
}
