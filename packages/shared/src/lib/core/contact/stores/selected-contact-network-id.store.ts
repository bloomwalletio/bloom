import { get, writable } from 'svelte/store'

export const selectedContactNetworkId = writable<string | undefined>(undefined)

export function clearSelectedContactNetworkId(): void {
    selectedContactNetworkId.set(undefined)
}

export function getSelectedContactNetworkId(): string | undefined {
    return get(selectedContactNetworkId)
}

export function setSelectedContactNetworkId(networkId: string): void {
    if (networkId) {
        selectedContactNetworkId.set(networkId)
    }
}
