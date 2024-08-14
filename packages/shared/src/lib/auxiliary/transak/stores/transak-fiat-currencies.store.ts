import { FiatCurrency } from '@core/market'
import { Writable, writable } from 'svelte/store'

export interface TransakFiatCurrency {
    paymentOptions: {
        id: string
        name: string
        minAmount: number
        maxAmount: number
        disabled?: boolean
    }[]
}

export type TransakFiatCurrencies = {
    [key in keyof typeof FiatCurrency]: TransakFiatCurrency
}

export const transakFiatCurrencies: Writable<TransakFiatCurrencies | undefined> = writable(undefined)
