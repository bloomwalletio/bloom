import { Writable } from 'svelte/store'
import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'
import { IIscChainConfiguration } from './evm-network-configuration.interface'
import { IBaseNetwork, IStardustNetworkMetadata } from '@core/network'

export interface IStardustNetwork extends IStardustNetworkMetadata, IBaseNetwork {
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string
    currentMilestone: Writable<number>

    addChain(chainConfiguration: IIscChainConfiguration): void
    editChain(networkId: NetworkId, payload: Partial<IIscChainConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
