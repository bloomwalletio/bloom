import { IBaseNetwork } from './base-network.interface'
import { NetworkNamespace } from '../enums'
import { EvmNetworkConfiguration, NetworkId } from '../types'
import { INetworkStatus } from './network-status.interface'

export interface IStardustNetwork extends IBaseNetwork {
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string

    getStatus(): INetworkStatus

    addChain(chainConfiguration: EvmNetworkConfiguration): void
    editChain(networkId: NetworkId, payload: Partial<EvmNetworkConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
