import { get } from 'svelte/store'
import { networks } from '../stores'

export function getAllNetworkIds(): string[] {
    return get(networks)?.map((network) => network.id) ?? []
}
