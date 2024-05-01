import { derived, get, Readable, Writable, writable } from 'svelte/store'
import { NftStandard } from '../enums'
import { Nft } from '../interfaces'
import { Collections } from '../types'
import { getCollectionFromNft } from '../utils'
import { selectedAccountNfts } from './selected-account-nfts.store'

export const collectionsStore: Writable<Collections> = writable({})

async function updateCollections(nfts: Nft[]): Promise<void> {
    const existingCollections = get(collectionsStore)

    if (nfts.length === 0) {
        if (Object.keys(existingCollections).length > 0) {
            collectionsStore.set({})
        }
        return
    }

    const collectionsUpdate = { ...existingCollections }

    await Promise.all(
        nfts.map(async (nft) => {
            const collectionId =
                nft.standard === NftStandard.Irc27
                    ? nft.issuer?.aliasId ?? nft.issuer?.nftId
                    : nft.contractMetadata.address
            if (!collectionId) {
                return
            }

            if (collectionsUpdate[collectionId]) {
                const existingCollection = collectionsUpdate[collectionId]
                if (!existingCollection.nfts.find((existingNft) => existingNft.id === nft.id)) {
                    if (existingCollection.standard === nft.standard) {
                        // @ts-expect-error - ignore type error because we are checking the standard of nft and collection match
                        existingCollection.nfts.push(nft)
                    }
                }
            } else {
                const collection = await getCollectionFromNft(nft)
                if (collection) {
                    // @ts-expect-error - ignore type error because the collection was generated from the nft
                    collectionsUpdate[collectionId] = { ...collection, nfts: [nft] }
                }
            }
        })
    )
    collectionsStore.set(collectionsUpdate)
}

selectedAccountNfts.subscribe((nfts) => {
    void updateCollections(nfts)
})

export const selectedAccountCollections: Readable<Collections> = derived(
    collectionsStore,
    ($collectionsStore) => $collectionsStore
)

export const collectionsSearchTerm: Writable<string> = writable('')
