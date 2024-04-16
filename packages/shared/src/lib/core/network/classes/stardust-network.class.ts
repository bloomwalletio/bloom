/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'
import { updateActiveProfile } from '@core/profile/stores'
import { NetworkNamespace } from '../enums'
import {
    IEvmNetwork,
    IIscpEvmNetworkConfiguration,
    INetworkStatus,
    IPersistedStardustNetwork,
    IProtocol,
    IStardustNetwork,
} from '../interfaces'
import { getStardustNetwork, networkStatus } from '../stores'
import { EvmNetworkConfiguration, NetworkId, StardustNetworkId } from '../types'

import { IscpChain } from './iscp-chain.class'
import { IBaseToken } from '@core/token'

export class StardustNetwork implements IStardustNetwork {
    public readonly id: StardustNetworkId
    public readonly name: string
    public readonly coinType: number
    public readonly namespace: NetworkNamespace.Stardust
    public readonly bech32Hrp: string
    public readonly protocol: IProtocol
    public readonly chainConfigurations: IIscpEvmNetworkConfiguration[]
    public readonly baseToken: IBaseToken
    public readonly

    constructor(persistedNetwork: IPersistedStardustNetwork) {
        this.id = persistedNetwork.id
        this.name = persistedNetwork.name
        this.coinType = persistedNetwork.coinType
        this.namespace = persistedNetwork.namespace
        this.bech32Hrp = persistedNetwork.protocol.bech32Hrp
        this.protocol = persistedNetwork.protocol
        this.chainConfigurations = persistedNetwork.chainConfigurations
        this.baseToken = persistedNetwork.baseToken
    }

    getStatus(): INetworkStatus {
        return get(networkStatus)
    }

    addChain(chainConfiguration: IIscpEvmNetworkConfiguration): IEvmNetwork {
        if (this.isChainAlreadyAdded(chainConfiguration)) {
            throw new Error('This evm network has already been added.')
        } else {
            const network = getStardustNetwork()
            network.chainConfigurations.push(chainConfiguration)
            /**
             * NOTE: Updating the active profile will cause the network store object to be
             * re-instantiated, which will also instantiate an object for the newly added
             * evmNetwork.
             */
            updateActiveProfile({ network })

            return new IscpChain(chainConfiguration)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: EvmNetworkConfiguration): boolean {
        const network = getStardustNetwork()

        return network.chainConfigurations.some((evmNetwork) => {
            const hasSameName = evmNetwork.name === chainConfiguration.name
            const hasSameId = evmNetwork.id === chainConfiguration.id
            return hasSameName || hasSameId
        })
    }

    editChain(networkId: NetworkId, payload: Partial<EvmNetworkConfiguration>): Promise<void> {
        return Promise.resolve()
    }

    removeChain(networkId: NetworkId): void {
        const network = getStardustNetwork()
        const newChains = network.chainConfigurations.filter(
            (chainConfiguration) => chainConfiguration.id !== networkId
        )
        updateActiveProfile({ network: { ...network, chainConfigurations: newChains } })
    }
}
