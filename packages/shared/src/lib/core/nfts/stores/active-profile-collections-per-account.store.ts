import { derived, writable } from 'svelte/store'
import { persistedCollections } from '.'
import { Collections } from '../types'
import { activeProfileNftsPerAccount } from './active-profile-nfts-per-account.store'

export const collectionsSearchTerm = writable('')

export const activeProfileCollectionsPerAccount = derived(
    [activeProfileNftsPerAccount],
    ([$activeProfileNftsPerAccount]) => {
        if (!Object.keys($activeProfileNftsPerAccount ?? {}).length) return {}

        const collectionsPerAccount: { [accountIndex: number]: Collections[] } = {}

        for (const accountIndex in $activeProfileNftsPerAccount) {
            const nfts = $activeProfileNftsPerAccount[accountIndex]
            for (const nft of nfts) {
                if (!nft.collectionId || !persistedCollections[nft.collectionId]) continue

                if (!collectionsPerAccount[nft.collectionId]) {
                    collectionsPerAccount[nft.collectionId] = { ...persistedCollections[nft.collectionId], nfts: [nft] }
                } else {
                    collectionsPerAccount[nft.collectionId].nfts.push(nft)
                }
            }
        }

        return collectionsPerAccount
    }
)
