import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { checkForUntrackedTokens, fetchEvmBalancesForAccount } from '../actions'
import { checkForUntrackedNfts } from '@core/nfts/actions'

export function fetchEvmBalancesForAllAccounts(profileId: string, addPreviouslyUntracked?: boolean): void {
    for (const account of get(activeAccounts)) {
        try {
            void checkForUntrackedTokens(account, addPreviouslyUntracked)
            void checkForUntrackedNfts(account)
            void fetchEvmBalancesForAccount(profileId, account)
        } catch (err) {
            console.error(err)
        }
    }
}
