import { Writable } from 'svelte/store'
import { NetworkHealth, NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface IBaseNetwork {
    health: Writable<NetworkHealth>

    startStatusPoll(): void
    destroy(): void
}

export interface IBaseNetworkMetadata {
    id: NetworkId
    namespace: NetworkNamespace
    name: string
    coinType: number
}
