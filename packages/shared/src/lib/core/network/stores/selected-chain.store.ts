import { Writable, writable } from 'svelte/store'
import { Network } from '../types'

export const selectedChain: Writable<Network | undefined> = writable(undefined)

export function setSelectedChain(evmNetwork: Network): void {
    selectedChain.set(evmNetwork)
}

export function clearSelectedChain(): void {
    selectedChain.set(undefined)
}
