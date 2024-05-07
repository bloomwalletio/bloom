import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { Collections } from '../types'
import { getCollectionFromNft, getCollectionIdFromNft } from '../utils'
import { activeProfileNftsPerAccount } from './active-profile-nfts-per-account.store'

export const persistedCollections = persistent<Collections>('persistedCollections', {})

activeProfileNftsPerAccount.subscribe((nftsPerAccount) => {
    if (!nftsPerAccount || Object.keys(nftsPerAccount).length === 0) {
        return
    }
    const nfts = Object.values(nftsPerAccount).flat()
    void updatePersistedCollectionFromNfts(nfts)
})

async function updatePersistedCollectionFromNfts(nfts: Nft[]): Promise<void> {
    const existingCollections = get(persistedCollections)

    const collectionsUpdate = { ...existingCollections }

    await Promise.all(
        nfts.map(async (nft) => {
            const collectionId = getCollectionIdFromNft(nft)
            if (!collectionId) {
                return
            }

            if (collectionsUpdate[collectionId]) {
                return
            }

            const collection = await getCollectionFromNft(nft)
            if (collection) {
                collectionsUpdate[collectionId] = collection
            }
        })
    )
    persistedCollections.set(collectionsUpdate)
}
