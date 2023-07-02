import { get, writable } from 'svelte/store'

export const selectedNetworkId = writable<string | undefined>(undefined)

export function clearSelectedNetworkId(): void {
    selectedNetworkId.set(undefined)
}

export function getSelectedNetworkId(): string | undefined {
    return get(selectedNetworkId)
}

export function setSelectedNetworkId(networkId: string): void {
    if (networkId) {
        selectedNetworkId.set(networkId)
    }
}
