import { Writable, writable } from 'svelte/store'
import { IEvmNetwork } from '../interfaces'

export const selectedChain: Writable<IEvmNetwork | undefined> = writable(undefined)

export function setSelectedChain(evmNetwork: IEvmNetwork): void {
    selectedChain.set(evmNetwork)
}

export function clearSelectedChain(): void {
    selectedChain.set(undefined)
}
