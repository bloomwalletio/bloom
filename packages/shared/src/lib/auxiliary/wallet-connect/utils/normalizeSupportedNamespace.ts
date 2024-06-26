import type { SessionTypes } from '@walletconnect/types'
import type { SupportedNamespaces } from '../types'

export function normalizeSessionNamespace(sessionNamespace: SessionTypes.Namespaces): SupportedNamespaces {
    const normalizedRecord: SupportedNamespaces = {}

    for (const key in sessionNamespace) {
        const session = sessionNamespace[key]
        normalizedRecord[key] = {
            ...session,
            chains: session.chains || [],
        }
    }

    return normalizedRecord
}
