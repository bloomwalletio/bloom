import { writable } from 'svelte/store'
import { IMintNftCollectionDetails } from '../interfaces'

export const mintNftCollectionDetails = writable<IMintNftCollectionDetails | undefined>(undefined)

export function setMintNftCollectionDetails(payload: IMintNftCollectionDetails): void {
    mintNftCollectionDetails.set(payload)
}

export function resetMintNftCollectionDetails(): void {
    mintNftCollectionDetails.set(undefined)
}
