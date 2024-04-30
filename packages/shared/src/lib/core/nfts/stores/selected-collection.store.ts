import { writable } from 'svelte/store'

export const selectedCollectionId = writable<string | undefined>(undefined)
