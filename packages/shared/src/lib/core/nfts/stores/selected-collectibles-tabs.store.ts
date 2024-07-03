import { Writable, writable } from 'svelte/store'

export const selectedCollectiblesTab: Writable<number> = writable(0)
