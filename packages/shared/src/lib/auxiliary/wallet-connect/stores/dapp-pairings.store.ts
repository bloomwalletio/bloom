import { Writable, get, writable } from 'svelte/store'
import { getWalletClient } from './wallet-client.store'
import { Pairing } from '../interface/pairing.interface'

export const dAppPairings: Writable<Pairing[]> = writable([])

export function setDAppPairings(): void {
    const pairings = getWalletClient()?.core.pairing.getPairings()
    dAppPairings.set(pairings ?? [])
}

export function getDappPairings(): Pairing[] {
    return get(dAppPairings)
}
