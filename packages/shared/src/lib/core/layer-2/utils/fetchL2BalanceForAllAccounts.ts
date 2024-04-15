import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { checkForUntrackedTokens, fetchL2BalanceForAccount } from '../actions'
import { checkForUntrackedNfts } from '@core/nfts/actions'

export function fetchL2BalanceForAllAccounts(profileId: string, addPreviouslyUntracked?: boolean): void {
    for (const account of get(activeAccounts)) {
        try {
            checkForUntrackedTokens(account, addPreviouslyUntracked)
            void checkForUntrackedNfts(account)
            fetchL2BalanceForAccount(profileId, account)
        } catch (err) {
            console.error(err)
        }
    }
}
