import { Writable, get, writable } from 'svelte/store'
import { persistedCollections } from '.'
import { Collections } from '../types'
import { Nft } from '../interfaces'
import { NftStandard } from '../enums'

export const collectionsSearchTerm = writable('')

export const activeProfileCollectionsPerAccount: Writable<{
    [accountIndex: number]: Collections
}> = writable({})

export function addNftsToCollection(accountIndex: number, nfts: Nft[]): void {
    if (!nfts.length) return

    const $persistedCollections = get(persistedCollections)
    activeProfileCollectionsPerAccount.update((state) => {
        for (const nft of nfts) {
            if (!nft.collectionId || !$persistedCollections[nft.collectionId]) {
                continue
            }

            if (!state[accountIndex]) {
                state[accountIndex] = {}
            }

            let collection = state[accountIndex][nft.collectionId]
            if (!collection) {
                collection = { ...$persistedCollections[nft.collectionId], nfts: [] }
            }

            if (collection.nfts.some((_nft) => _nft.id === nft.id) || !nft.isSpendable) {
                continue
            }

            if (collection.standard === NftStandard.Irc27 && nft.standard === NftStandard.Irc27) {
                collection.nfts?.push(nft)
            } else if (collection.standard === NftStandard.Erc721 && nft.standard === NftStandard.Erc721) {
                collection.nfts?.push(nft)
            }
            state[accountIndex][nft.collectionId] = collection
        }

        return state
    })
}

export function removeNftFromCollections(accountIndex: number, nftId: string): void {
    activeProfileCollectionsPerAccount.update((state) => {
        for (const collectionId in state[accountIndex]) {
            const collection = state[accountIndex][collectionId]
            const nftIndex = collection.nfts.findIndex((nft) => nft.id === nftId)
            if (nftIndex !== -1) {
                collection.nfts.splice(nftIndex, 1)
            }
        }

        return state
    })
}

export function clearActiveProfileCollectionsPerAccount(): void {
    activeProfileCollectionsPerAccount.set({})
}
