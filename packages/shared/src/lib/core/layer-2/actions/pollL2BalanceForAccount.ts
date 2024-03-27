import { IAccountState } from '@core/account/interfaces'
import { checkForUntrackedNfts } from '@core/nfts/actions'
import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { checkForUntrackedTokens, fetchL2BalanceForAccount } from '.'
import { handleError } from '@core/error/handlers'

let pollInterval: number

export function pollL2BalanceForAccount(profileId: string, account: IAccountState): void {
    try {
        clearL2TokensPoll()
        checkForUntrackedTokens(account)
        void checkForUntrackedNfts(account)
        fetchL2BalanceForAccount(profileId, account)
        pollInterval = window.setInterval(() => {
            fetchL2BalanceForAccount(profileId, account)
        }, LAYER2_TOKENS_POLL_INTERVAL)
    } catch (err) {
        handleError(err)
    }
}

export function clearL2TokensPoll(): void {
    clearInterval(pollInterval)
}
