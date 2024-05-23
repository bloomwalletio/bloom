import { get } from 'svelte/store'
import { addCollectionsToPersistedCollections, persistedCollections } from '../stores'
import { Nft, PersistedCollection } from '../interfaces'
import { buildPersistedCollectionFromNft } from '../utils'

export async function updatePersistedCollections(nfts: Nft[]): Promise<void> {
    const collectionsToAdd: PersistedCollection[] = []
    for (const nft of nfts) {
        if (!nft.collectionId || get(persistedCollections)[nft.collectionId]) {
            continue
        }

        const collection = await buildPersistedCollectionFromNft(nft)
        if (collection) {
            collectionsToAdd.push(collection)
        }
    }
    addCollectionsToPersistedCollections(collectionsToAdd)
}
