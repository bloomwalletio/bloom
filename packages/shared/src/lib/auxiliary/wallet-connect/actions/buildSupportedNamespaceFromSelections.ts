import { ProposalTypes } from '@walletconnect/types'
import { GENERAL_SUPPORTED_METHODS, SUPPORTED_EVENTS } from '../constants'
import { NetworkId } from '@core/network/types'
import { ISelections } from '../interface'
import { ISupportedNamespace, SupportedNamespaces } from '../types'
import { buildAccountForWalletConnect } from '../utils'

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

    const methods = selections.methods ?? persistedNamespaces?.methods ?? []
    const allowedMethods = [...methods, ...GENERAL_SUPPORTED_METHODS].filter(
        (method) => requiredNamespace?.methods?.includes(method) || optionalNamespace?.methods?.includes(method)
    )

    let addresses: string[] = []
    if (selections.accounts) {
        addresses = allowedChains.flatMap((evmNetwork) => {
            return (
                selections.accounts
                    ?.map((account) => buildAccountForWalletConnect(account, evmNetwork as NetworkId) ?? '')
                    .filter(Boolean) ?? []
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
