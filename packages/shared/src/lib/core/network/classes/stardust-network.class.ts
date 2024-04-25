/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkNamespace } from '../enums'
import {
    IEvmNetwork,
    IIscChainConfiguration,
    INetworkStatus,
    IProtocol,
    IStardustNetwork,
    IStardustNetworkMetadata,
} from '../interfaces'
import { addNetwork, networkStatus } from '../stores'
import { NetworkId, StardustNetworkId } from '../types'

import { IBaseToken } from '@core/token'
import { IscChain } from '@core/network/classes/isc-chain.class'

export class StardustNetwork implements IStardustNetwork {
    public readonly id: StardustNetworkId
    public readonly name: string
    public readonly networkName: string
    public readonly coinType: number
    public readonly namespace: NetworkNamespace.Stardust
    public readonly bech32Hrp: string
    public readonly protocol: IProtocol
    public readonly baseToken: IBaseToken
    public readonly iscChains: IscChain[]

    constructor(persistedNetwork: IStardustNetworkMetadata) {
        this.id = persistedNetwork.id
        this.name = persistedNetwork.name
        this.coinType = persistedNetwork.coinType
        this.namespace = persistedNetwork.namespace
        this.bech32Hrp = persistedNetwork.protocol.bech32Hrp
        this.networkName = persistedNetwork.protocol.networkName
        this.protocol = persistedNetwork.protocol
        this.baseToken = persistedNetwork.baseToken

        this.iscChains = persistedNetwork.chainConfigurations
            .map((chainConfiguration) => {
                return new IscChain(chainConfiguration)
            })
            .filter(Boolean)
    }

    getStatus(): INetworkStatus {
        return get(networkStatus)
    }

    addChain(chainConfiguration: IIscChainConfiguration): void {
        if (this.isChainAlreadyAdded(chainConfiguration)) {
            throw new Error('This evm network has already been added.')
        } else {
            const network = get(activeProfile)?.network
            network.chainConfigurations.push(chainConfiguration)
            updateActiveProfile({ network })

            const iscChain = new IscChain(chainConfiguration)
            this.iscChains.push(iscChain)
            addNetwork(iscChain)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: IIscChainConfiguration): boolean {
        return this.iscChains.some(({ name, id }) => {
            const hasSameName = name === chainConfiguration.name
            const hasSameId = id === chainConfiguration.id
            return hasSameName || hasSameId
        })
    }

    editChain(networkId: NetworkId, payload: Partial<IIscChainConfiguration>): Promise<void> {
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
