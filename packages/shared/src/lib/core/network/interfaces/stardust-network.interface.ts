import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'
import { IEvmNetwork } from './evm-network.interface'
import { INetworkStatus } from './network-status.interface'
import { IIscpEvmNetworkConfiguration, IPersistedStardustNetwork } from '@core/network'

export interface IStardustNetwork extends IPersistedStardustNetwork {
    namespace: NetworkNamespace.Stardust
    bech32Hrp: string

    getStatus(): INetworkStatus

    addChain(chainConfiguration: IIscpEvmNetworkConfiguration): IEvmNetwork
    editChain(networkId: NetworkId, payload: Partial<IIscpEvmNetworkConfiguration>): Promise<void>
    removeChain(networkId: NetworkId): void
}
