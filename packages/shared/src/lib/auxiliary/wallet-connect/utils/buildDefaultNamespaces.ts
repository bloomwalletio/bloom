import { getEvmNetworks } from '@core/network'
import { SupportedNamespaces } from '../types'
import { getCaip10AddressForAccount } from './buildCaip10Address'
import { ALL_SUPPORTED_METHODS, SUPPORTED_EVENTS } from '../constants'
import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import type { ProposalTypes } from '@walletconnect/types'

export function buildDefaultNamespaces(
    requiredNamespaces: ProposalTypes.RequiredNamespaces,
    optionalNamespaces: ProposalTypes.OptionalNamespaces
): SupportedNamespaces {
    const allChainids = [...Object.values(requiredNamespaces), ...Object.values(optionalNamespaces)]
        .flatMap(({ chains }) => chains)
        .filter(Boolean)

    const namespace: SupportedNamespaces = {}
    for (const network of getEvmNetworks()) {
        if (!allChainids.includes(network.id)) {
            continue
        }
        if (!namespace[network.namespace]) {
            const accounts = get(activeAccounts)
                .map((account) => getCaip10AddressForAccount(account, network.id) as string)
                .filter(Boolean)
            namespace[network.namespace] = {
                chains: [],
                methods: ALL_SUPPORTED_METHODS,
                events: SUPPORTED_EVENTS,
                accounts,
            }
        }
        namespace[network.namespace].chains.push(network.id)
    }
    return namespace
}
