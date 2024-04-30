import { get, writable } from 'svelte/store'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkHealth, NetworkNamespace, NetworkType } from '../enums'
import { IIscChainConfiguration, IProtocol, IStardustNetwork, IStardustNetworkMetadata } from '../interfaces'
import { EvmNetworkId, StardustNetworkId } from '../types'

import { getAndUpdateNodeInfo } from '@core/network/actions'
import { getNetworkStatusFromNodeInfo } from '@core/network/helpers'
import { NETWORK_STATUS_POLL_INTERVAL } from '@core/network/constants'
import { IBaseToken } from '@core/token/interfaces'

import { addChain, removeChain } from '../stores'
import { IscChain } from './isc-chain.class'

export class StardustNetwork implements IStardustNetwork {
    public readonly id: StardustNetworkId
    public readonly name: string
    public readonly networkName: string
    public readonly coinType: number
    public readonly namespace: NetworkNamespace.Stardust
    public readonly bech32Hrp: string
    public readonly protocol: IProtocol
    public readonly baseToken: IBaseToken
    public readonly type = NetworkType.Stardust

    public iscChains: IscChain[]
    public health = writable(NetworkHealth.Operational)
    public currentMilestone = writable(-1)

    private statusPoll: number | undefined

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

        void this.startStatusPoll()
    }

    startStatusPoll(): void {
        this.statusPoll = window.setInterval(() => {
            getAndUpdateNodeInfo().then((nodeResponse) => {
                const { health, currentMilestone } = getNetworkStatusFromNodeInfo(nodeResponse?.nodeInfo)
                this.currentMilestone.set(currentMilestone)
                this.health.set(health)
            })
        }, NETWORK_STATUS_POLL_INTERVAL)
    }

    destroy(): void {
        clearInterval(this.statusPoll)
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
