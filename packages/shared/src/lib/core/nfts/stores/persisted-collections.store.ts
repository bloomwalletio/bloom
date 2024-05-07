import { persistent } from '@core/utils/store'
import { Collection } from '../interfaces'
import { Collections } from '../types'

export const persistedCollections = persistent<Collections>('persistedCollections', {})

export function addCollectionsToPersistedCollections(collections: Collection[]): void {
    persistedCollections.update((state) => {
        for (const collection of collections) {
            if (state[collection.id]) {
                continue
            }

            state[collection.id] = collection
        }
        return state
    })
}

export function addCollectionToPersistedCollections(collection: Collection): void {
    addCollectionsToPersistedCollections([collection])
}
