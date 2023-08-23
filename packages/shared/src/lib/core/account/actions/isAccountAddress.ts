import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { network } from '@core/network/stores'
import { NetworkId, isStardustNetwork } from '@core/network'

export function isAccountAddress(address: string, destinationNetworkId: NetworkId): boolean {
    if (isStardustNetwork(destinationNetworkId)) {
        return isAccountBech32Address(address)
    } else {
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
