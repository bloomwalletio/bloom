import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { fetchLayer2BalanceForAccount } from '.'
import { IAccountState } from '@core/account'

let pollInterval: number

export function pollLayer2BalanceForAccount(account: IAccountState): void {
    clearLayer2TokensPoll()
    fetchLayer2BalanceForAccount(account)
    pollInterval = window.setInterval(() => {
        fetchLayer2BalanceForAccount(account)
    }, LAYER2_TOKENS_POLL_INTERVAL)
}

export function clearLayer2TokensPoll(): void {
    clearInterval(pollInterval)
}
