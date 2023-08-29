import { writable } from 'svelte/store'

export const isPollingLedgerNanoState = writable<boolean>(false)
