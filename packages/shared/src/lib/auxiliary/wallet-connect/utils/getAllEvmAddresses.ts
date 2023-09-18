import { get } from 'svelte/store'
import { ETHEREUM_COIN_TYPE } from '@core/network'
import { activeAccounts } from '@core/profile/stores'

export function getAllEvmAddresses(chains: string[]): string[] {
    const _accounts = get(activeAccounts)
    const evmAddresses = _accounts
        .map((account) => account.evmAddresses[ETHEREUM_COIN_TYPE])
        .filter((addr) => !!addr) as string[]

    return chains.map((chain) => evmAddresses.map((addr) => `${chain}:${addr}`)).flat()
}
