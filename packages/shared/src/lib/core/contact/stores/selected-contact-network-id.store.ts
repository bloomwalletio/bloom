import { NetworkId } from '@core/network'
import { get, writable } from 'svelte/store'

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
