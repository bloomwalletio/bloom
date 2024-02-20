import { getWalletClient, setConnectedDapps } from '../stores'
import { SupportedNamespaces } from '../types'
import { handleError } from '@core/error/handlers'

export async function updateSession(sessionTopic: string, updatedNamespaces: SupportedNamespaces): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        await client.updateSession({ topic: sessionTopic, namespaces: updatedNamespaces })
        setConnectedDapps()
    } catch (err) {
        handleError(err)
    }
}
