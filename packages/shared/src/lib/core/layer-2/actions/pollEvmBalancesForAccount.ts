import { IAccountState } from '@core/account/interfaces'
import { checkForUntrackedNfts } from '@core/nfts/actions'
import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { checkForUntrackedTokens, fetchEvmBalancesForAccount } from '.'
import { handleError } from '@core/error/handlers'

let pollInterval: number

export function pollEvmBalancesForAccount(profileId: string, account: IAccountState): void {
    try {
        clearL2TokensPoll()
        void checkForUntrackedTokens(account)
        void checkForUntrackedNfts(account)
        void fetchEvmBalancesForAccount(profileId, account)
        pollInterval = window.setInterval(() => {
            void fetchEvmBalancesForAccount(profileId, account)
        }, LAYER2_TOKENS_POLL_INTERVAL)
    } catch (err) {
        handleError(err)
    }
}

export function clearL2TokensPoll(): void {
    clearInterval(pollInterval)
}
