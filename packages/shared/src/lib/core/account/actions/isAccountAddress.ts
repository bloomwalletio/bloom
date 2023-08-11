import { get } from 'svelte/store'

import { DestinationNetwork } from '@core/layer-2/enums'
import { activeAccounts } from '@core/profile/stores'
import { network } from '@core/network/stores'

export function isAccountAddress(address: string, destinationNetwork: DestinationNetwork): boolean {
    switch (destinationNetwork) {
        case DestinationNetwork.Shimmer:
        case DestinationNetwork.Testnet:
            return isAccountBech32Address(address)
        case DestinationNetwork.ShimmerEvm:
        case DestinationNetwork.ShimmerEvmTestnet:
            return isAccountEvmAddress(address)
    }
}

function isAccountBech32Address(address: string): boolean {
    for (const account of get(activeAccounts)) {
        if (account && account.depositAddress === address) {
            return true
        }
    }
    return false
}

function isAccountEvmAddress(address: string): boolean {
    for (const account of get(activeAccounts) ?? []) {
        for (const chain of get(network)?.getChains() ?? []) {
            if (account && account.evmAddresses[chain.getConfiguration().coinType] === address) {
                return true
            }
        }
    }
    return false
}
