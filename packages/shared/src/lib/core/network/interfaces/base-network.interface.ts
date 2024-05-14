import { IBaseToken } from '@core/token'
import { Writable } from 'svelte/store'
import { NetworkHealth, NetworkNamespace, NetworkType } from '../enums'
import { NetworkId } from '../types'

export interface IBaseNetwork {
    type: NetworkType
    health: Writable<NetworkHealth>

    startStatusPoll(): void
    destroy(): void
}

export interface IBaseNetworkMetadata {
    id: NetworkId
    namespace: NetworkNamespace
    name: string
    baseToken: IBaseToken
    coinType: number
    explorerUrl: string | undefined
}
