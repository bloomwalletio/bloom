import { ETHEREUM_COIN_TYPE } from '@core/network'
import { activeAccounts } from '@core/profile/stores'
import { get } from 'svelte/store'

export function getAllEvmAddresses(chains: string[]): string[] {
    const _accounts = get(activeAccounts)
    const evmAddresses = _accounts
        .map((account) => account.evmAddresses[ETHEREUM_COIN_TYPE])
        .filter((addr) => !!addr) as string[]

    return chains.map((evmNetwork) => evmAddresses.map((addr) => `${evmNetwork}:${addr}`)).flat()
}
