import { writable, Writable } from 'svelte/store'
import { TransakCryptoCurrency } from './transak-crypto-currencies.store'

export const selectedExchangeCryptoCurrency: Writable<TransakCryptoCurrency | undefined> = writable(undefined)
