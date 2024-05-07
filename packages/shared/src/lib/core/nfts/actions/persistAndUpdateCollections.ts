import { get } from 'svelte/store'
import { addCollectionsToPersistedCollections, addNftsToCollection, persistedCollections } from '../stores'
import { Nft } from '../interfaces'
import { getCollectionFromNft } from '../utils'
import { Collections } from '../types'

export async function persistAndUpdateCollections(accountIndex: number, nfts: Nft[]): Promise<void> {
    const _persistedCollections = get(persistedCollections)

    const collections: Collections = {}
    for (const nft of nfts) {
        if (!nft.collectionId) {
            continue
        }
        if (!_persistedCollections[nft.collectionId] && !collections[nft.collectionId]) {
            const collection = await getCollectionFromNft(nft)
            if (collection) {
                collections[nft.collectionId] = collection
            }
        }
    }
    addCollectionsToPersistedCollections(Object.values(collections))
    addNftsToCollection(accountIndex, nfts)
}
