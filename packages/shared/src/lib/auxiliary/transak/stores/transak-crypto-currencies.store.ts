import { Writable, writable } from 'svelte/store'

export type TransakCryptoCurrency = {
    name: string
    symbol: string
    image: { thumb: string; small: string; large: string }
    networkName: string
    chainId?: string | null
    decimals: number
}

export const transakCryptoCurrencies: Writable<TransakCryptoCurrency[] | undefined> = writable(undefined)
