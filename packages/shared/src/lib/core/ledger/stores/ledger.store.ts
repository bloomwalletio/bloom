import { writable } from 'svelte/store'

import { LedgerApi } from '../classes'
import { ILedgerApi } from '../interfaces'

export const ledger = writable<ILedgerApi>(new LedgerApi())
