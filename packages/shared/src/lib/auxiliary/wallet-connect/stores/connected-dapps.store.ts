import { Writable, get, writable } from 'svelte/store'
import { getWalletClient } from './wallet-client.store'
import { Pairing } from '../interface/pairing.interface'

export const connectedDapps: Writable<Pairing[]> = writable([])

export function setConnectedDapps(): void {
    const pairings = getWalletClient()?.core.pairing.getPairings()
    connectedDapps.set(pairings ?? [])
}

export function getConnectedDapps(): Pairing[] {
    return get(connectedDapps)
}
