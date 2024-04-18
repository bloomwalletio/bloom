import { Writable, writable, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { IscpChain, StardustNetwork } from '../classes'
import { IEvmNetwork, IIscpEvmNetworkConfiguration, IStardustNetwork } from '../interfaces'
import { EvmNetworkConfiguration, Network, NetworkId } from '../types'
import { EvmNetworkType, NetworkNamespace } from '../enums'

export const networks: Writable<Network[]> = writable([])

export function initializeNetworks(): void {
    const profile = get(activeProfile)
    if (profile && profile.network) {
        const stardustNetwork = new StardustNetwork(profile.network)
        const chains = profile.network.chainConfigurations
            .map((chainConfiguration) => {
                switch (chainConfiguration.type) {
                    case EvmNetworkType.Iscp:
                        return new IscpChain(chainConfiguration)
                    default:
                        return undefined
                }
            })
            .filter(Boolean) as IEvmNetwork[]
        networks.set([stardustNetwork, ...chains])
    }
}

export function addNetwork(chainConfiguration: EvmNetworkConfiguration): void {
    const network = getNetwork(chainConfiguration.id)
    if (network) {
        return
    }

    networks.update((networks) => {
        networks.push(new IscpChain(chainConfiguration as IIscpEvmNetworkConfiguration))
        return networks
    })
}

export function getNetwork(networkId: NetworkId): Network | undefined {
    return get(networks)?.find((network) => network.id === networkId)
}

export function getL1Network(): IStardustNetwork {
    const l1Network = get(networks)?.find(
        (network) => network.namespace === NetworkNamespace.Stardust
    ) as IStardustNetwork
    if (!l1Network) {
        throw new Error('Network is undefined!')
    }
    return l1Network
}

export function getEvmNetworks(): IEvmNetwork[] {
    return (get(networks)?.filter((network) => network.namespace === NetworkNamespace.Evm) as IEvmNetwork[]) ?? []
}

export function getEvmNetwork(networkId: NetworkId): IEvmNetwork | undefined {
    return get(networks)?.find(
        (network) => network.namespace === NetworkNamespace.Evm && network.id === networkId
    ) as IEvmNetwork
}

export function getIscpChains(): IscpChain[] {
    return (
        (get(networks)?.filter(
            (network) => network.namespace === NetworkNamespace.Evm && network.type === EvmNetworkType.Iscp
        ) as IscpChain[]) ?? []
    )
}
