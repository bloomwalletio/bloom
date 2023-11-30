import { ProposalTypes } from '@walletconnect/types'
import { SUPPORTED_EVENTS } from '../constants'
import { getAddressFromAccountForNetwork } from '@core/account/utils'
import { NetworkId } from '@core/network/types'
import { ISelections } from '../interface'
import { ISupportedNamespace, SupportedNamespaces } from '../types'

export function buildSupportedNamespacesFromSelections(
    selections: ISelections,
    requiredNamespaces: ProposalTypes.RequiredNamespaces,
    optionalNamespaces: ProposalTypes.OptionalNamespaces,
    persistedNamespaces?: SupportedNamespaces
): SupportedNamespaces {
    const supportedNamespaces: SupportedNamespaces = {}
    const allNamespaceIds = new Set([...Object.keys(requiredNamespaces), ...Object.keys(optionalNamespaces)])

    for (const namespaceId of allNamespaceIds) {
        const supportedNamespace = buildSupportedNamespace(
            selections,
            persistedNamespaces?.[namespaceId],
            requiredNamespaces[namespaceId],
            optionalNamespaces[namespaceId]
        )
        supportedNamespaces[namespaceId] = supportedNamespace
    }

    return supportedNamespaces
}

function buildSupportedNamespace(
    selections: ISelections,
    persistedNamespaces: ISupportedNamespace | undefined,
    requiredNamespace: ProposalTypes.RequiredNamespace | undefined,
    optionalNamespace: ProposalTypes.RequiredNamespace | undefined
): ISupportedNamespace {
    const allowedChains = selections.chains
        ? selections.chains.filter(
              (network) => requiredNamespace?.chains?.includes(network) || optionalNamespace?.chains?.includes(network)
          )
        : persistedNamespaces?.chains ?? []

    const allowedMethods = selections.methods
        ? selections.methods.filter(
              (method) => requiredNamespace?.methods?.includes(method) || optionalNamespace?.methods?.includes(method)
          )
        : persistedNamespaces?.methods ?? []

    let addresses: string[] = []
    if (selections.accounts) {
        addresses = allowedChains.flatMap((chain) => {
            return (
                selections.accounts
                    ?.map((account) => getAddressFromAccountForNetwork(account, chain as NetworkId))
                    .filter(Boolean)
                    .map((address) => `${chain}:${address}`) ?? []
            )
        })
    } else {
        addresses = persistedNamespaces?.accounts ?? []
    }

    return {
        chains: allowedChains,
        methods: allowedMethods,
        events: SUPPORTED_EVENTS,
        accounts: addresses,
    }
}
