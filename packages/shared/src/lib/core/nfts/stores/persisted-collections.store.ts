import { persistent } from '@core/utils/store'
import { PersistedCollection } from '../interfaces'
import { PersistedCollections } from '../types'

export const persistedCollections = persistent<PersistedCollections>('persistedCollections', {})

export function addCollectionsToPersistedCollections(collections: PersistedCollection[]): void {
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
