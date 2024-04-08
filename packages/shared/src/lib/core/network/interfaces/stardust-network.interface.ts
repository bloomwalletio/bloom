import { INetwork } from './network.interface'
import { NetworkNamespace } from '../enums'
import { ChainConfiguration, NetworkId } from '../types'
import { IChain } from './chain.interface'
import { INetworkStatus } from './network-status.interface'

export interface IStardustNetwork extends INetwork {
    namespace: NetworkNamespace.Stardust

    getStatus(): INetworkStatus

    getChain(networkId: NetworkId): IChain | undefined
    getChains(): IChain[]
    getIscpChains(): IChain[]
    addChain(chainConfiguration: ChainConfiguration): IChain
    editChain(networkId: NetworkId, payload: Partial<ChainConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
