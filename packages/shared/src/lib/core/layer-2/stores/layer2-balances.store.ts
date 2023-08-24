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
