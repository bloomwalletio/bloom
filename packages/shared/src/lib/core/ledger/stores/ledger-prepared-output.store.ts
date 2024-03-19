import { Output } from '@core/wallet'
import { writable } from 'svelte/store'

export const ledgerPreparedOutput = writable<Output | undefined>(undefined)

export function resetLedgerPreparedOutput(): void {
    ledgerPreparedOutput.set(undefined)
}
