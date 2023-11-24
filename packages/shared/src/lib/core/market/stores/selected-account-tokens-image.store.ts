import { writable } from 'svelte/store'

export const selectedAccountTokensThumbs = writable<Record<string, string>>({})
