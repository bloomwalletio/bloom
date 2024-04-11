import { INetwork } from './network.interface'
import { NetworkNamespace } from '../enums'
import { ChainConfiguration, NetworkId } from '../types'
import { IChain } from './chain.interface'
import { INetworkStatus } from './network-status.interface'

export interface IStardustNetwork extends INetwork {
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string

    getStatus(): INetworkStatus

    addChain(chainConfiguration: ChainConfiguration): IChain
    editChain(networkId: NetworkId, payload: Partial<ChainConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
