import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'
import { IEvmNetwork } from './evm-network.interface'
import { INetworkStatus } from './network-status.interface'
import { IIscNetworkConfiguration } from './evm-network-configuration.interface'
import { IStardustNetworkMetadata } from '@core/network'

export interface IStardustNetwork extends IStardustNetworkMetadata {
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string

    getStatus(): INetworkStatus

    addChain(chainConfiguration: IIscNetworkConfiguration): IEvmNetwork
    editChain(networkId: NetworkId, payload: Partial<IIscNetworkConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
