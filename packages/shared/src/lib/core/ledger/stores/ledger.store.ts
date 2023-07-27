import { writable } from 'svelte/store'

import { Ledger } from '../classes'
import { ILedger } from '../interfaces'

console.log('init ledger')
export const ledger = writable<ILedger>(new Ledger())
