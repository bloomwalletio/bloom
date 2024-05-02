import { Writable, writable } from 'svelte/store'
import { Network } from '../types'

export const selectedNetwork: Writable<Network | undefined> = writable(undefined)

export function setSelectedNetwork(evmNetwork: Network): void {
    selectedNetwork.set(evmNetwork)
}

export function clearSelectedNetwork(): void {
    selectedNetwork.set(undefined)
}
