import { getPersistedDappNamespacesForDapp, getWalletClient, setConnectedDapps } from '../stores'
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
            }
        } catch (err) {
            console.error('Error updating session', err)
        }
    }
    setConnectedDapps()
}
