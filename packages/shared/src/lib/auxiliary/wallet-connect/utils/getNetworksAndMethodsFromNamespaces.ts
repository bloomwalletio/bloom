import type { ProposalTypes } from '@walletconnect/types'
import { RpcMethod } from '../enums'

export function getNetworksAndMethodsFromNamespaces(
    requiredNamespaces: ProposalTypes.RequiredNamespaces,
    optionalNamespaces: ProposalTypes.OptionalNamespaces
): {
    requiredNetworks: string[]
    optionalNetworks: string[]
    requiredMethods: RpcMethod[]
    optionalMethods: RpcMethod[]
} {
    const requiredNetworks: string[] = []
    const optionalNetworks: string[] = []
    const requiredMethods: RpcMethod[] = []
    const optionalMethods: RpcMethod[] = []

    for (const namespace of Object.values(requiredNamespaces ?? {})) {
        if (namespace.chains) {
            requiredNetworks.push(...namespace.chains)
        }
        if (namespace.methods) {
            requiredMethods.push(...(namespace.methods as RpcMethod[]))
        }
    }

    for (const namespace of Object.values(optionalNamespaces ?? {})) {
        if (namespace.chains) {
            requiredNetworks.push(...namespace.chains)
        }
        if (namespace.methods) {
            requiredMethods.push(...(namespace.methods as RpcMethod[]))
        }
    }

    return {
        requiredNetworks,
        optionalNetworks,
        requiredMethods,
        optionalMethods,
    }
}
