import { get } from 'svelte/store'
import { addCollectionToPersistedCollections, persistedCollections } from '../stores'
import { Nft } from '../interfaces'
import { buildPersistedCollectionFromNft } from '../utils'

export async function addPersistedCollection(nft: Nft): Promise<void> {
    if (!nft.collectionId || get(persistedCollections)[nft.collectionId]) {
        return
    }

    const collection = await buildPersistedCollectionFromNft(nft)
    if (collection) {
        addCollectionToPersistedCollections(collection)
    }
}
