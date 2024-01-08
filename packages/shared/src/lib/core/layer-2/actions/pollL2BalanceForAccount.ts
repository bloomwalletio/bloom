import { IAccountState } from '@core/account/interfaces'
import { checkForUntrackedNfts } from '@core/nfts/actions'
import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { checkForUntrackedTokens, fetchL2BalanceForAccount } from '.'
import { handleError } from '@core/error/handlers'
import { IError } from '@core/error'

let pollInterval: number

export function pollL2BalanceForAccount(account: IAccountState): void {
    console.log('pollL2BalanceForAccount', account)
    try {
        clearL2TokensPoll()
        checkForUntrackedTokens(account)
        void checkForUntrackedNfts(account)
        fetchL2BalanceForAccount(account)
        pollInterval = window.setInterval(() => {
            fetchL2BalanceForAccount(account)
        }, LAYER2_TOKENS_POLL_INTERVAL)
    } catch (err) {
        handleError(err as IError)
    }
}

export function clearL2TokensPoll(): void {
    clearInterval(pollInterval)
}
