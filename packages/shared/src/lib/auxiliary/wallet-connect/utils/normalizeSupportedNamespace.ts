import type { SessionTypes } from '@walletconnect/types'
import type { ISupportedNamespace } from '../types'

export function normalizeSessionNamespace(
    sessionNamespace: SessionTypes.Namespaces
): Record<string, ISupportedNamespace> {
    const normalizedRecord: Record<string, ISupportedNamespace> = {}

    for (const key in sessionNamespace) {
        const session = sessionNamespace[key]
        normalizedRecord[key] = {
            ...session,
            chains: session.chains || [],
        }
    }

    return normalizedRecord
}
