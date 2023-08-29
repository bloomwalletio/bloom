import { Readable, derived } from 'svelte/store'
import { LedgerConnectionState } from '../enums'
import { determineLedgerConnectionState } from '../utils'
import { ledgerDeviceState } from './ledger-device-state.store'

export const ledgerConnectionState: Readable<LedgerConnectionState> = derived(
    [ledgerDeviceState],
    ([$ledgerNanoState]) => determineLedgerConnectionState($ledgerNanoState)
)
