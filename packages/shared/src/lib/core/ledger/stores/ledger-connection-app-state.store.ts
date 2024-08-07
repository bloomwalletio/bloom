import { Readable, derived } from 'svelte/store'
import { determineLedgerConnectionAppState } from '../utils'
import { ledgerDeviceState } from './ledger-device-state.store'
import { ILedgerConnectionAppState } from '../interfaces/ledger-connection-app-state.interface'

export const ledgerConnectionAppState: Readable<ILedgerConnectionAppState> = derived(
    [ledgerDeviceState],
    ([$ledgerNanoState]) => determineLedgerConnectionAppState($ledgerNanoState)
)
