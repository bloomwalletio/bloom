import { writable } from 'svelte/store'

export const isPollingLedgerDeviceState = writable<boolean>(false)
