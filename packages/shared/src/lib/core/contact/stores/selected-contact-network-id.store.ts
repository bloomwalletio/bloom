import { get, writable } from 'svelte/store'
import { NetworkId } from '@core/network'

export const selectedContactNetworkId = writable<NetworkId | undefined>(undefined)

export function clearSelectedContactNetworkId(): void {
    selectedContactNetworkId.set(undefined)
}

export function getSelectedContactNetworkId(): NetworkId | undefined {
    return get(selectedContactNetworkId)
}

export function setSelectedContactNetworkId(networkId: NetworkId): void {
    if (networkId) {
        selectedContactNetworkId.set(networkId)
    }
}
