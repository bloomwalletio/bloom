import { writable } from 'svelte/store'

export const isPollingLedgerDeviceStatus = writable<boolean>(false)
export const isPollingLedgerEthereumAppSettings = writable<boolean>(false)
