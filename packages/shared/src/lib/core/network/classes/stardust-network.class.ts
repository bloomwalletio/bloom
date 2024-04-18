/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkNamespace } from '../enums'
import {
    IEvmNetwork,
    IIscNetworkConfiguration,
    INetworkStatus,
    IProtocol,
    IStardustNetwork,
    IStardustNetworkMetadata,
} from '../interfaces'
import { networkStatus } from '../stores'
import { NetworkId, StardustNetworkId } from '../types'

import { IscpChain } from './iscp-chain.class'
import { IBaseToken } from '@core/token'

export class StardustNetwork implements IStardustNetwork {
    public readonly id: StardustNetworkId
    public readonly name: string
    public readonly networkName: string
    public readonly coinType: number
    public readonly namespace: NetworkNamespace.Stardust
    public readonly bech32Hrp: string
    public readonly protocol: IProtocol
    public readonly baseToken: IBaseToken
    public readonly chainConfigurations: IIscNetworkConfiguration[]

    constructor(persistedNetwork: IStardustNetworkMetadata) {
        this.id = persistedNetwork.id
        this.name = persistedNetwork.name
        this.coinType = persistedNetwork.coinType
        this.namespace = persistedNetwork.namespace
        this.bech32Hrp = persistedNetwork.protocol.bech32Hrp
        this.networkName = persistedNetwork.protocol.networkName
        this.protocol = persistedNetwork.protocol
        this.baseToken = persistedNetwork.baseToken
        this.chainConfigurations = persistedNetwork.chainConfigurations
    }

    getStatus(): INetworkStatus {
        return get(networkStatus)
    }

    addChain(chainConfiguration: IIscNetworkConfiguration): IEvmNetwork {
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

            this.chainConfigurations.push(chainConfiguration)
            return new IscpChain(chainConfiguration)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: IIscNetworkConfiguration): boolean {
        return this.chainConfigurations.some((evmNetwork) => {
            const hasSameName = evmNetwork.name === chainConfiguration.name
            const hasSameId = evmNetwork.id === chainConfiguration.id
            return hasSameName || hasSameId
        })
    }

    editChain(networkId: NetworkId, payload: Partial<IIscNetworkConfiguration>): Promise<void> {
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
