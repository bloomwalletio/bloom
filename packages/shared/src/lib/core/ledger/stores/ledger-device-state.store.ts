import { writable } from 'svelte/store'
import { LedgerNanoStatus } from '@iota/wallet'
import { ILedgerEthereumAppSettings, ILedgerDeviceState } from '../interfaces'
import { buildLedgerDeviceState } from '../utils'

const DEFAULT_LEDGER_STATUS: ILedgerDeviceState = {
    connected: false,
    locked: true,
}

export const ledgerDeviceState = writable<ILedgerDeviceState>(DEFAULT_LEDGER_STATUS)

export function setLedgerDeviceState(status: LedgerNanoStatus, ethereumAppSettings?: ILedgerEthereumAppSettings): void {
    return ledgerDeviceState.set(buildLedgerDeviceState(status, ethereumAppSettings))
}

export function resetLedgerDeviceState(): void {
    ledgerDeviceState.set(DEFAULT_LEDGER_STATUS)
}
