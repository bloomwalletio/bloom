import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { NetworkId, isStardustNetwork } from '@core/network'

export function isAccountAddress(address: string, destinationNetworkId: NetworkId): boolean {
    if (isStardustNetwork(destinationNetworkId)) {
        return isAccountBech32Address(address)
    } else {
        return isAccountEvmAddress(address)
    }
}

function isAccountBech32Address(address: string): boolean {
    return get(activeAccounts)?.some((account) => account && account.depositAddress === address)
}

function isAccountEvmAddress(address: string): boolean {
    return get(activeAccounts)?.some((account) =>
        Object.values(account.evmAddresses ?? {}).some((evmAddress) => evmAddress === address)
    )
}
