import { Writable, writable, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import features from '@features/features'

import { IscChain, EvmNetwork, StardustNetwork } from '../classes'
import { IEvmNetwork, IIscChain, IStardustNetwork } from '../interfaces'
import { Network, NetworkId } from '../types'
import { EvmNetworkType, NetworkNamespace } from '../enums'

export const networks: Writable<Network[]> = writable([])

export function initializeNetworks(): void {
    const profile = get(activeProfile)
    const _networks: Network[] = []
    if (profile?.network) {
        const stardustNetwork = new StardustNetwork(profile.network)
        _networks.push(stardustNetwork, ...stardustNetwork.iscChains)
    }

    if (features.network.evmNetworks.enabled) {
        profile.evmNetworks?.forEach((evmNetwork) => {
            _networks.push(new EvmNetwork(evmNetwork))
        })
    }

    networks.set(_networks)
}

export function addNetwork(chain: IIscChain): void {
    const network = getNetwork(chain.id)
    if (network) {
        return
    }

    networks.update((networks) => {
        networks.push(chain)
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
