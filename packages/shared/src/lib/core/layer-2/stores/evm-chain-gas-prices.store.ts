import { get, writable } from 'svelte/store'
import { NetworkId } from '@core/network/types'
import { EvmChainGasPrices } from '../types'

export const evmChainGasPrices = writable<EvmChainGasPrices>({})

export function getEvmChainGasPrice(networkId: NetworkId): bigint | undefined {
    return get(evmChainGasPrices)[networkId]
}
