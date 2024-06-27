import { getAllNetworkIds, getEvmNetworks } from '@core/network'
import { SupportedNamespaces } from '../types'
import { getCaip10AddressForAccount } from './buildCaip10Address'
import { ALL_SUPPORTED_METHODS, SUPPORTED_EVENTS } from '../constants'
import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'

export function buildDefaultNamespaces(): SupportedNamespaces {
    const allChainIds = getAllNetworkIds()

    const namespace: SupportedNamespaces = {}
    for (const network of getEvmNetworks()) {
        if (!allChainIds.includes(network.id)) {
            continue
        }
        if (!namespace[network.namespace]) {
            namespace[network.namespace] = {
                chains: [],
                methods: ALL_SUPPORTED_METHODS,
                events: SUPPORTED_EVENTS,
                accounts: [],
            }
        }
        namespace[network.namespace].chains.push(network.id)
        const accounts = get(activeAccounts)
            .map((account) => getCaip10AddressForAccount(account, network.id) as string)
            .filter(Boolean)
        namespace[network.namespace].accounts.push(...accounts)
    }
    return namespace
}
