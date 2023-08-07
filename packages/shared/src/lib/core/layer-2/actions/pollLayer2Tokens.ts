import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { fetchSelectedAccountLayer2Balance } from '.'
import { IAccountState } from '@core/account'

let pollInterval: number

export function pollLayer2Tokens(account: IAccountState): void {
    clearLayer2TokensPoll()
    fetchSelectedAccountLayer2Balance(account)
    pollInterval = window.setInterval(() => {
        fetchSelectedAccountLayer2Balance(account)
    }, LAYER2_TOKENS_POLL_INTERVAL)
}

export function clearLayer2TokensPoll(): void {
    clearInterval(pollInterval)
}
