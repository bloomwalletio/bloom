import { derived, get, Readable, Writable, writable } from 'svelte/store'
import { selectedAccountNfts } from './selected-account-nfts.store'
import { NftStandard } from '../enums'
import { Nft } from '../interfaces'
import { getCollectionFromNft } from '../utils'
import { Collections } from '../types'

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
            if (nft.standard !== NftStandard.Irc27 || !nft.issuer?.aliasId) {
                return
            }

            const issuerAliasId = nft.issuer.aliasId

            if (!collectionsUpdate[issuerAliasId]) {
                const collection = await getCollectionFromNft(nft)
                if (collection) {
                    collectionsUpdate[issuerAliasId] = { ...collection, nfts: [nft] }
                }
            } else {
                const existingNfts = collectionsUpdate[issuerAliasId].nfts
                if (!existingNfts.find((existingNft) => existingNft.id === nft.id)) {
                    collectionsUpdate[issuerAliasId].nfts.push(nft)
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
