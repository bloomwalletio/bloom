import { get, writable } from 'svelte/store'
import { NetworkId } from '@core/network/types'
import { isEvmChain } from '@core/network/utils'
import { EvmChainGasPrices } from '../types'

export const evmChainGasPrices = writable<EvmChainGasPrices>({})

export function getEvmChainGasPrice(networkId: NetworkId): bigint | undefined {
    return get(evmChainGasPrices)[networkId]
}

export function setEvmChainGasPrice(price: bigint, networkId: NetworkId): void {
    evmChainGasPrices.update((state) => {
        if (typeof price === 'bigint' && isEvmChain(networkId)) {
            return {
                ...state,
                [networkId]: price,
            }
        } else {
            return state
        }
    })
}
