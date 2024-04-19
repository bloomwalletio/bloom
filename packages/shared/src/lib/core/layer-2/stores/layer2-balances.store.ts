import { get, writable } from 'svelte/store'
import { EvmNetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { ILayer2ProfileBalances } from '../interfaces'
import { Layer2AccountBalance } from '../types'
import { logAndNotifyError } from '@core/error/actions'
import { ITokenBalance } from '@core/token/interfaces'

export const layer2Balances = writable<ILayer2ProfileBalances | undefined>(undefined)

export function getLayer2AccountBalance(accountIndex: number): Layer2AccountBalance | undefined {
    return get(layer2Balances)?.[accountIndex]
}

export function getLayer2AccountBalanceForToken(
    accountIndex: number,
    networkId: EvmNetworkId,
    tokenId: string = BASE_TOKEN_ID
): bigint {
    const layer2TokenBalance = get(layer2Balances)?.[accountIndex]?.[networkId]?.[tokenId]
    return layer2TokenBalance ?? BigInt(0)
}

export function setLayer2AccountBalanceForChain(
    accountIndex: number,
    networkId: EvmNetworkId,
    chainBalance: ITokenBalance
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
    networkId: EvmNetworkId,
    tokenId: string,
    delta: bigint
): bigint {
    let newBalance = BigInt(0)
    layer2Balances.update((balance) => {
        if (!balance) {
            balance = {}
        }
        const accountBalance = balance[accountIndex] ?? {}
        const accountNetworkBalance = accountBalance[networkId] ?? {}
        const oldBalance = accountNetworkBalance[tokenId] ?? BigInt(0)

        newBalance = oldBalance + delta
        if (newBalance < 0) {
            logAndNotifyError({
                type: 'general',
                message: `Updated Layer 2 Balance for token with token ID ${tokenId} is negative!`,
                logToConsole: true,
                saveToErrorLog: true,
            })
            newBalance = BigInt(0)
        }

        accountNetworkBalance[tokenId] = newBalance
        accountBalance[networkId] = accountNetworkBalance
        balance[accountIndex] = accountBalance
        return balance
    })
    return newBalance
}

export function clearLayer2Balance(): void {
    layer2Balances.set(undefined)
}
