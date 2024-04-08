import { NetworkNamespace } from '../enums'
import { ChainConfiguration, NetworkId } from '../types'
import { IChain } from './chain.interface'
import { INetworkStatus } from './network-status.interface'
import { IProtocol } from './protocol.interface'

export interface INetwork {
    id: NetworkId
    namespace: NetworkNamespace.Stardust
    name: string
    coinType: number
    protocol: IProtocol

    getStatus(): INetworkStatus

    getChain(networkId: NetworkId): IChain | undefined
    getChains(): IChain[]
    getIscpChains(): IChain[]
    addChain(chainConfiguration: ChainConfiguration): IChain
    editChain(networkId: NetworkId, payload: Partial<ChainConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
