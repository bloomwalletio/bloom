import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { checkForUntrackedTokens, fetchEvmBalancesForAccount } from '../actions'
import { checkForUntrackedNfts } from '@core/nfts/actions'

export function fetchEvmBalancesForAllAccounts(addPreviouslyUntracked?: boolean): void {
    for (const account of get(activeAccounts)) {
        try {
            checkForUntrackedTokens(account, addPreviouslyUntracked)
            void checkForUntrackedNfts(account)
            fetchEvmBalancesForAccount(account)
        } catch (err) {
            console.error(err)
        }
    }
}
