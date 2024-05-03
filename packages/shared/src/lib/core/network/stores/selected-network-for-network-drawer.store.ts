import { Writable, writable } from 'svelte/store'
import { Network } from '../types'

export const selectedNetworkForNetworkDrawer: Writable<Network | undefined> = writable(undefined)

export function setSelectedNetworkForNetworkDrawer(evmNetwork: Network): void {
    selectedNetworkForNetworkDrawer.set(evmNetwork)
}

export function clearSelectedNetworkForNetworkDrawer(): void {
    selectedNetworkForNetworkDrawer.set(undefined)
}
