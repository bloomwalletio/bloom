import { get, writable } from 'svelte/store'

export const selectedAccountIndex = writable<number>(0)

export function getSelectedAccountIndex(): number {
    return get(selectedAccountIndex)
}
