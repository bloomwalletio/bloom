import { get } from 'svelte/store'
import { collectionsSearchTerm } from '../stores'
import { Collection } from '../interfaces'

export function isVisibleCollection(collection: Collection): boolean {
    const searchTerm = get(collectionsSearchTerm)

    if (!isVisibleWithSearchTerm(collection, searchTerm)) {
        return false
    }

    return true
}

function isVisibleWithSearchTerm(collection: Collection, searchTerm: string): boolean {
    if (searchTerm) {
        return collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
}
