import { ProposalTypes } from '@walletconnect/types'
import { SUPPORTED_EVENTS } from '../constants'
import { getAddressFromAccountForNetwork } from '@core/account/utils'
import { NetworkId } from '@core/network/types'
import { IAccountState } from '@core/account'

type SupportedNamespaces = Record<string, ISupportedNamespace>

interface ISupportedNamespace {
    chains: string[]
    methods: string[]
    events: string[]
    accounts: string[]
}

interface Selections {
    chains: string[]
    methods: string[]
    accounts: IAccountState[]
}

export function buildSupportedNamespacesFromSelections(
    selections: Selections,
    requiredNamespaces: ProposalTypes.RequiredNamespaces,
    optionalNamespaces: ProposalTypes.OptionalNamespaces
): SupportedNamespaces {
    const supportedNamespaces: SupportedNamespaces = {}
    const allNamespaceIds = new Set([...Object.keys(requiredNamespaces), ...Object.keys(optionalNamespaces)])

    for (const namespaceId of allNamespaceIds) {
        const supportedNamespace = buildSupportedNamespace(
            selections,
            requiredNamespaces[namespaceId],
            optionalNamespaces[namespaceId]
        )
        supportedNamespaces[namespaceId] = supportedNamespace
    }

    return supportedNamespaces
}

function buildSupportedNamespace(
    selections: Selections,
    requiredNamespace: ProposalTypes.RequiredNamespace | undefined,
    optionalNamespace: ProposalTypes.RequiredNamespace | undefined
): ISupportedNamespace {
    const allowedChains = selections.chains.filter(
        (network) => requiredNamespace?.chains?.includes(network) || optionalNamespace?.chains?.includes(network)
    )
    const allowedMethods = selections.methods.filter(
        (method) => requiredNamespace?.methods?.includes(method) || optionalNamespace?.methods?.includes(method)
    )

    const addresses: string[] = []
    for (const chain of allowedChains) {
        for (const account of selections.accounts) {
            const address = getAddressFromAccountForNetwork(account, chain as NetworkId)
            if (address) {
                addresses.push(`${chain}:${address}`)
            }
        }
    }

    return {
        chains: allowedChains,
        methods: allowedMethods,
        events: SUPPORTED_EVENTS,
        accounts: addresses,
    }
}
