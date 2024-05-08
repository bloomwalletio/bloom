import { derived, get, Readable, Writable, writable } from 'svelte/store'
import { NftStandard } from '../enums'
import { Nft } from '../interfaces'
import { Collections } from '../types'
import { getCollectionFromNft } from '../utils'
import { ownedNfts, selectedAccountNfts } from './selected-account-nfts.store'
import { isFeatureEnabled } from '@lib/features/utils'

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
    if (isFeatureEnabled('collectibles.collections')) {
        void updateCollections(nfts.filter((nft) => nft.isSpendable))
    }
})

export const selectedAccountCollections: Readable<Collections> = derived(
    [collectionsStore, ownedNfts],
    ([$collectionsStore, $ownedNfts]) => {
        const accountCollections: Collections = {}
        for (const collectionId in $collectionsStore) {
            const collection = $collectionsStore[collectionId]
            const nftsForAccount = collection.nfts.filter((nft) =>
                $ownedNfts.some((ownedNft) => ownedNft.id === nft.id)
            )
            if (nftsForAccount.length > 0) {
                // @ts-expect-error - ignore type error because we are filtering the existing nfts for the account
                accountCollections[collectionId] = { ...collection, nfts: nftsForAccount }
            } else {
                delete accountCollections[collectionId]
            }
        }
        return accountCollections
    }
)

export const collectionsSearchTerm: Writable<string> = writable('')
