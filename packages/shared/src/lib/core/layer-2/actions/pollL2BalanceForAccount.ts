import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { checkForUntrackedTokens, fetchL2BalanceForAccount } from '.'
import { IAccountState } from '@core/account'

let pollInterval: number

export function pollL2BalanceForAccount(account: IAccountState): void {
    clearL2TokensPoll()
    checkForUntrackedTokens(account)
    fetchL2BalanceForAccount(account)
    pollInterval = window.setInterval(() => {
        fetchL2BalanceForAccount(account)
    }, LAYER2_TOKENS_POLL_INTERVAL)
}

export function clearL2TokensPoll(): void {
    clearInterval(pollInterval)
}
