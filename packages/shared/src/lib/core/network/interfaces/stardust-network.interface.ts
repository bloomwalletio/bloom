import { Writable } from 'svelte/store'
import { NetworkNamespace, NetworkType } from '../enums'
import { NetworkId } from '../types'
import { IIscChainConfiguration } from './evm-network-configuration.interface'
import { IBaseNetwork, IscChain, IStardustNetworkMetadata } from '@core/network'

export interface IStardustNetwork
    extends Omit<IBaseNetwork, 'type'>,
        Omit<IStardustNetworkMetadata, 'chainConfigurations'> {
    type: NetworkType.Stardust
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string

    currentMilestone: Writable<number>

    iscChains: IscChain[]

    addChain(chainConfiguration: IIscChainConfiguration): void
    removeChain(networkId: NetworkId): void
}
