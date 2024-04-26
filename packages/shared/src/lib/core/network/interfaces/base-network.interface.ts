import { Writable } from 'svelte/store'
import { NetworkHealth, NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface IBaseNetwork {
    id: NetworkId
    namespace: NetworkNamespace
    name: string
    coinType: number
    health: Writable<NetworkHealth>

    startStatusPoll(): void
    destroy(): void
}
