import { NetworkNamespace } from '../enums'
import { ChainConfiguration, NetworkId, NetworkMetadata } from '../types'
import { IChain } from './chain.interface'
import { INetworkStatus } from './network-status.interface'

export interface INetwork {
    id: NetworkId
    namespace: NetworkNamespace.Stardust
    name: string

    getMetadata(): NetworkMetadata
    getStatus(): INetworkStatus

    getChain(networkId: NetworkId): IChain | undefined
    getChains(): IChain[]
    getIscpChains(): IChain[]
    addChain(chainConfiguration: ChainConfiguration): IChain
    editChain(networkId: NetworkId, payload: Partial<ChainConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
