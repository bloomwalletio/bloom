import { disconnectDapp } from '../actions'
import { getConnectedDapps, getPersistedDappNamespacesForDapp, getWalletClient } from '../stores'
import { handleError } from '@core/error/handlers'
import { updateSession } from './updateSession'

export async function updateSessionForConnectedDapps(): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }
    const dapps = getConnectedDapps()

    for (const dapp of dapps) {
        if (!dapp.metadata?.url) {
            continue
        }

        try {
            const persistedNamespaces = getPersistedDappNamespacesForDapp(dapp.metadata?.url)
            if (dapp.session && persistedNamespaces) {
                await updateSession(dapp.session.topic, persistedNamespaces)
            } else {
                await disconnectDapp(dapp)
            }
        } catch (err) {
            handleError(err)
        }
    }
}
