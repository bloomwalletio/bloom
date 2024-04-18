import { Readable, derived, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { IscpChain, StardustNetwork } from '../classes'
import { IEvmNetwork, IStardustNetwork } from '../interfaces'
import { Network, NetworkId } from '../types'
import { EvmNetworkType, NetworkNamespace } from '../enums'

export const networks: Readable<Network[] | undefined> = derived([activeProfile], ([$activeProfile]) => {
    if ($activeProfile && $activeProfile.network) {
        const stardustNetwork = new StardustNetwork($activeProfile.network)
        const chains = $activeProfile.network.chainConfigurations
            .map((chainConfiguration) => {
                return new IscpChain(chainConfiguration)
            })
            .filter(Boolean) as IEvmNetwork[]
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
