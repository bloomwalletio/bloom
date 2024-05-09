import { persistent } from '@core/utils/store'
import { PersistedCollection } from '../interfaces'
import { PersistedCollections } from '../types'

export const persistedCollections = persistent<PersistedCollections>('persistedCollections', {})

export function addCollectionToPersistedCollections(collection: PersistedCollection): void {
    persistedCollections.update((state) => {
        if (state[collection.id]) {
            return state
        }

        state[collection.id] = collection
        return state
    })
}
