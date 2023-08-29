import { Readable, derived } from 'svelte/store'
import { LedgerConnectionState } from '../enums'
import { determineLedgerConnectionState } from '../utils'
import { ledgerNanoState } from './ledger-nano-state.store'

export const ledgerConnectionState: Readable<LedgerConnectionState> = derived([ledgerNanoState], ([$ledgerNanoState]) =>
    determineLedgerConnectionState($ledgerNanoState)
)
