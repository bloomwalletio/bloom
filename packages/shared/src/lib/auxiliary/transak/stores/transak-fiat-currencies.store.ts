import { FiatCurrency } from '@core/market'
import { Writable, writable } from 'svelte/store'

export type TransakFiatCurrencies = {
    [key in keyof typeof FiatCurrency]: {
        paymentOptions: {
            id: string
            minAmount: number
            maxAmount: number
            disabled?: boolean
        }[]
    }
}

export const transakFiatCurrencies: Writable<TransakFiatCurrencies | undefined> = writable(undefined)
