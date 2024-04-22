import { Writable, writable, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import features from '@features/features'

import { IscChain, EvmNetwork, StardustNetwork } from '../classes'
import { IEvmNetwork, IIscChainConfiguration, IStardustNetwork } from '../interfaces'
import { Network, NetworkId } from '../types'
import { EvmNetworkType, NetworkNamespace } from '../enums'

export const networks: Writable<Network[]> = writable([])

export function initializeNetworks(): void {
    const profile = get(activeProfile)
    let _networks: Network[] = []
    if (profile?.network) {
        const stardustNetwork = new StardustNetwork(profile.network)
        const chains = profile.network.chainConfigurations
            .map((chainConfiguration) => {
                return new IscChain(chainConfiguration)
            })
            .filter(Boolean) as IEvmNetwork[]
        _networks = [stardustNetwork, ...chains]
    }

    if (features.network.evmNetworks.enabled) {
        profile.evmNetworks?.forEach((evmNetwork) => {
            const newNetwork = new EvmNetwork(evmNetwork)
            _networks.push(newNetwork)
        })
    }

    networks.set(_networks)
}

export function addNetwork(chainConfiguration: IIscChainConfiguration): void {
    const network = getNetwork(chainConfiguration.id)
    if (network) {
        return
    }

    networks.update((networks) => {
        networks.push(new IscChain(chainConfiguration))
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

export function getIscChains(): IscChain[] {
    return (
        (get(networks)?.filter(
            (network) => network.namespace === NetworkNamespace.Evm && network.type === EvmNetworkType.Isc
        ) as IscChain[]) ?? []
    )
}

export function getIscChain(networkId: NetworkId): IscChain | undefined {
    const iscChains = getIscChains()
    return iscChains.find(({ id }) => id === networkId)
}
