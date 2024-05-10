import { get } from 'svelte/store'
import { collectionsSearchTerm } from '../stores'
import { PersistedCollection } from '../interfaces'

export function isVisibleCollection(collection: PersistedCollection): boolean {
    const searchTerm = get(collectionsSearchTerm)

    if (!isVisibleWithSearchTerm(collection, searchTerm)) {
        return false
    }

    return true
}

function isVisibleWithSearchTerm(collection: PersistedCollection, searchTerm: string): boolean {
    if (searchTerm) {
        return collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
}
