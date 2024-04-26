import { get, writable, Writable } from 'svelte/store'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkHealth, NetworkNamespace } from '../enums'
import { IIscChainConfiguration, IProtocol, IStardustNetwork, IStardustNetworkMetadata } from '../interfaces'
import { addNetwork } from '../stores'
import { NetworkId, StardustNetworkId } from '../types'

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
    public readonly chainConfigurations: IIscChainConfiguration[]

    public health: Writable<NetworkHealth>

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
        this.chainConfigurations = persistedNetwork.chainConfigurations
        this.health = writable(NetworkHealth.Operational)

        void this.startStatusPoll()
    }

    startStatusPoll(): void {
        this.statusPoll = window.setInterval(() => {
            this.health.set(
                get(this.health) === NetworkHealth.Operational ? NetworkHealth.Degraded : NetworkHealth.Operational
            )
            // getAndUpdateNodeInfo().then(
            //     (nodeResponse) => (this.health.set(getNetworkStatusFromNodeInfo(nodeResponse?.nodeInfo).health))
            // )
        }, 1000)
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

            this.chainConfigurations.push(chainConfiguration)
            addNetwork(chainConfiguration)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: IIscChainConfiguration): boolean {
        return this.chainConfigurations.some((evmNetwork) => {
            const hasSameName = evmNetwork.name === chainConfiguration.name
            const hasSameId = evmNetwork.id === chainConfiguration.id
            return hasSameName || hasSameId
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
