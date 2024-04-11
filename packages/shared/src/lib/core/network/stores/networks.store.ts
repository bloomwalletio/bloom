import { Readable, derived, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { IscpChain, StardustNetwork } from '../classes'
import { IChain, IStardustNetwork } from '../interfaces'
import { Network, NetworkId } from '../types'
import { ChainType, NetworkNamespace } from '../enums'

export const networks: Readable<Network[] | undefined> = derived([activeProfile], ([$activeProfile]) => {
    if ($activeProfile && $activeProfile.network) {
        const stardustNetwork = new StardustNetwork($activeProfile.network)
        const chains = $activeProfile.network.chainConfigurations
            .map((chainConfiguration) => {
                switch (chainConfiguration.type) {
                    case ChainType.Iscp:
                        return new IscpChain(chainConfiguration)
                    case ChainType.Evm:
                        return undefined
                    default:
                        return undefined
                }
            })
            .filter(Boolean) as IChain[]
        return [stardustNetwork, ...chains]
    } else {
        return undefined
    }
})

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

export function getChains(): IChain[] {
    return (get(networks)?.filter((network) => network.namespace === NetworkNamespace.Evm) as IChain[]) ?? []
}

export function getChain(networkId: NetworkId): IChain | undefined {
    return get(networks)?.find(
        (network) => network.namespace === NetworkNamespace.Evm && network.id === networkId
    ) as IChain
}

export function getIscpChains(): IscpChain[] {
    return (
        (get(networks)?.filter(
            (network) => network.namespace === NetworkNamespace.Evm && network.type === ChainType.Iscp
        ) as IscpChain[]) ?? []
    )
}
