import { writable } from 'svelte/store'
import { ILedgerEthereumAppSettings } from '../interfaces'

export const ledgerEthereumAppSettings = writable<ILedgerEthereumAppSettings | undefined>()

export function setLedgerEthereumAppSettings(settings: ILedgerEthereumAppSettings): void {
    if (settings) {
        ledgerEthereumAppSettings.set(settings)
    }
}

export function resetLedgerEthereumAppSettings(): void {
    ledgerEthereumAppSettings.set(undefined)
}
