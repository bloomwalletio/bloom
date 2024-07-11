import { NetworkId } from '@core/network'
import { Writable, writable } from 'svelte/store'

export type TransakCryptoCurrency = {
    name: string
    symbol: string
    image: { thumb: string; small: string; large: string }
    network: {
        id: NetworkId
        transakNetworkName: string
        chainId?: string | null | undefined
    }
    decimals: number
}

export const transakCryptoCurrencies: Writable<TransakCryptoCurrency[] | undefined> = writable(undefined)
