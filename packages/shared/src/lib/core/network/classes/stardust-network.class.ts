/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import { activeProfile, updateActiveProfile } from '@core/profile/stores'

import { EvmNetworkType, NetworkNamespace } from '../enums'
import { IEvmNetwork, IIscpEvmNetworkConfiguration, INetworkStatus, IStardustNetwork } from '../interfaces'
import { networkStatus } from '../stores'
import { EvmNetworkConfiguration, NetworkId, NetworkMetadata } from '../types'

import { IscpChain } from './iscp-chain.class'

export class StardustNetwork implements IStardustNetwork {
    public readonly id: NetworkId
    public readonly name: string
    public readonly coinType: number
    public readonly namespace: NetworkNamespace.Stardust
    public readonly bech32Hrp: string

    constructor(metadata: NetworkMetadata) {
        this.id = metadata.id
        this.name = metadata.name
        this.coinType = metadata.coinType
        this.namespace = metadata.namespace
        this.bech32Hrp = metadata.protocol.bech32Hrp
    }

    getStatus(): INetworkStatus {
        return get(networkStatus)
    }

    addChain(chainConfiguration: EvmNetworkConfiguration): IEvmNetwork {
        if (this.isChainAlreadyAdded(chainConfiguration)) {
            throw new Error('This evm network has already been added.')
        } else {
            const network = get(activeProfile)?.network
            network.chainConfigurations.push(chainConfiguration)
            /**
             * NOTE: Updating the active profile will cause the network store object to be
             * re-instantiated, which will also instantiate an object for the newly added
             * evmNetwork.
             */
            updateActiveProfile({ network })

            return new IscpChain(<IIscpEvmNetworkConfiguration>chainConfiguration)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: EvmNetworkConfiguration): boolean {
        const network = get(activeProfile)?.network
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
        const network = get(activeProfile).network
        const newChains = network.chainConfigurations.filter(
            (chainConfiguration) => chainConfiguration.id !== networkId
        )
        updateActiveProfile({ network: { ...network, chainConfigurations: newChains } })
    }
}
