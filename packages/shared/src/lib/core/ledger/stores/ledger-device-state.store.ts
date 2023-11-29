import { writable } from 'svelte/store'
import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { ILedgerEthereumAppSettings, ILedgerDeviceState } from '../interfaces'
import { buildLedgerDeviceState } from '../utils'

const DEFAULT_LEDGER_DEVICE_STATE: ILedgerDeviceState = {
    connected: false,
    locked: true,
}

export const ledgerDeviceState = writable<ILedgerDeviceState>(DEFAULT_LEDGER_DEVICE_STATE)

export function setLedgerDeviceState(status: LedgerNanoStatus, ethereumAppSettings?: ILedgerEthereumAppSettings): void {
    const deviceState = buildLedgerDeviceState(status, ethereumAppSettings)
    return ledgerDeviceState.set(deviceState)
}

export function resetLedgerDeviceState(): void {
    ledgerDeviceState.set(DEFAULT_LEDGER_DEVICE_STATE)
}
