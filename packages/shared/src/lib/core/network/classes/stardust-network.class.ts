import { get } from 'svelte/store'
import { IBaseToken } from '@core/token/interfaces'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkNamespace } from '../enums'
import {
    IIscChainConfiguration,
    INetworkStatus,
    IProtocol,
    IStardustNetwork,
    IStardustNetworkMetadata,
} from '../interfaces'
import { IscChain } from '../classes'
import { addChain, networkStatus, removeChain } from '../stores'
import { EvmNetworkId, StardustNetworkId } from '../types'

export class StardustNetwork implements IStardustNetwork {
    public readonly id: StardustNetworkId
    public readonly name: string
    public readonly networkName: string
    public readonly coinType: number
    public readonly namespace: NetworkNamespace.Stardust
    public readonly bech32Hrp: string
    public readonly protocol: IProtocol
    public readonly baseToken: IBaseToken
    public iscChains: IscChain[]

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
            addChain(iscChain)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: IIscChainConfiguration): boolean {
        return this.iscChains.some(({ name, id }) => {
            const hasSameName = name === chainConfiguration.name
            const hasSameId = id === chainConfiguration.id
            return hasSameName || hasSameId
        })
    }

    removeChain(networkId: EvmNetworkId): void {
        const network = get(activeProfile).network
        const newChains = network.chainConfigurations.filter(
            (chainConfiguration) => chainConfiguration.id !== networkId
        )
        this.iscChains = this.iscChains.filter((chain) => chain.id === networkId)
        removeChain(networkId)
        updateActiveProfile({ network: { ...network, chainConfigurations: newChains } })
    }
}
