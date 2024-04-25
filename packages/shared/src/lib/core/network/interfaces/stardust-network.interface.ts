import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'
import { INetworkStatus } from './network-status.interface'
import { IIscChainConfiguration } from './evm-network-configuration.interface'
import { IscChain, IStardustNetworkMetadata } from '@core/network'

export interface IStardustNetwork extends Omit<IStardustNetworkMetadata, 'chainConfigurations'> {
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string

    iscChains: IscChain[]

    getStatus(): INetworkStatus

    addChain(chainConfiguration: IIscChainConfiguration): void
    removeChain(networkId: NetworkId): void
}
