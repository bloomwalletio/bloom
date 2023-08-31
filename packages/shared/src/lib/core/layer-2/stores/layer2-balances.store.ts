import { get, writable } from 'svelte/store'
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
