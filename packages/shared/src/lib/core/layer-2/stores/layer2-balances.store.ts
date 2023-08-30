import { NetworkId } from '@core/network'
import { ILayer2ProfileBalances } from '../interfaces'
import { get, writable } from 'svelte/store'
import { Layer2AccountBalance } from '../types'

export const layer2Balances = writable<ILayer2ProfileBalances | undefined>(undefined)

export function getLayer2AccountBalance(accountIndex: number): Layer2AccountBalance | undefined {
    return get(layer2Balances)?.[accountIndex]
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

        accountNetworkBalance[tokenId] = newBalance
        accountBalance[networkId] = accountNetworkBalance
        balance[accountIndex] = accountBalance
        return balance
    })
    return newBalance
}
