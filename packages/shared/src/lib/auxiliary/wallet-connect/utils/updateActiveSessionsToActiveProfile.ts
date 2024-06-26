import { DappVerification } from '../enums'
import { getPersistedDappNamespacesForDapp, getWalletClient, persistDapp, setConnectedDapps } from '../stores'
import { buildDefaultNamespaces } from './buildDefaultNamespaces'

export async function updateActiveSessionsToActiveProfile(): Promise<void> {
    const activeSessions = getWalletClient()?.getActiveSessions() ?? {}
    for (const session of Object.values(activeSessions)) {
        try {
            const persistedSupportedNamespaces = getPersistedDappNamespacesForDapp(session.peer.metadata.url)
            if (persistedSupportedNamespaces) {
                await getWalletClient()?.updateSession({
                    topic: session.topic,
                    namespaces: persistedSupportedNamespaces,
                })
            } else {
                const supportedNamespaces = buildDefaultNamespaces(
                    session.requiredNamespaces,
                    session.optionalNamespaces
                )
                await getWalletClient()?.updateSession({ topic: session.topic, namespaces: supportedNamespaces })
                persistDapp(
                    session.peer.metadata.url,
                    DappVerification.Unknown,
                    session.requiredNamespaces,
                    session.optionalNamespaces,
                    supportedNamespaces
                )
            }
        } catch (err) {
            console.error('Error updating session', err)
        }
    }
    setConnectedDapps()
}
