import { Network } from '@core/network'
import { Writable, writable } from 'svelte/store'

export type TransakCryptoCurrency = {
    name: string
    symbol: string
    image: { thumb: string; small: string; large: string }
    network: Network
    transakNetworkName: string
    decimals: number
}

export const transakCryptoCurrencies: Writable<TransakCryptoCurrency[] | undefined> = writable(undefined)
