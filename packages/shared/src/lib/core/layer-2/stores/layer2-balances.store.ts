import { get, writable } from 'svelte/store'
import { logAndNotifyError } from '@core/error/actions'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { ILayer2ProfileBalances } from '../interfaces'
import { Layer2AccountBalance } from '../types'

export const layer2Balances = writable<ILayer2ProfileBalances | undefined>(undefined)

export function getLayer2AccountBalance(accountIndex: number): Layer2AccountBalance | undefined {
    return get(layer2Balances)?.[accountIndex]
}

export function getLayer2AccountBalanceForToken(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string = BASE_TOKEN_ID
): number | undefined {
    return get(layer2Balances)?.[accountIndex]?.[networkId]?.[tokenId]
}

export function setLayer2AccountBalanceForChain(
    accountIndex: number,
    networkId: NetworkId,
    chainBalance: { [tokenId: string]: number }
): void {
    layer2Balances.update((balance) => {
        if (!balance) {
            balance = {}
        }
        if (!balance[accountIndex]) {
            balance[accountIndex] = {}
        }
        balance[accountIndex] = { ...balance[accountIndex], [networkId]: chainBalance }
        return balance
    })
}

export function updateLayer2AccountBalanceForTokenOnChain(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string,
    delta: number
): number {
    let newBalance = 0
    layer2Balances.update((balance) => {
        if (!balance) {
            balance = {}
        }
        const accountBalance = balance[accountIndex] ?? {}
        const accountNetworkBalance = accountBalance[networkId] ?? {}
        const oldBalance = accountNetworkBalance[tokenId] ?? 0

        newBalance = oldBalance + delta
        if (newBalance < 0) {
            logAndNotifyError({
                type: 'general',
                message: `Updated Layer 2 Balance for token with token ID ${tokenId} is negative!`,
                logToConsole: true,
                saveToErrorLog: true,
            })
            newBalance = 0
        }

        accountNetworkBalance[tokenId] = newBalance
        accountBalance[networkId] = accountNetworkBalance
        balance[accountIndex] = accountBalance
        return balance
    })
    return newBalance
}
