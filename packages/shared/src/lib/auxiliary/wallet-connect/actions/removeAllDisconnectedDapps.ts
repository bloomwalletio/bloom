import {
    connectedDapps,
    getPersistedDappNamespacesForDapp,
    getWalletClient,
    removeDappNamespacesForDapp,
} from '../stores'
import { get } from 'svelte/store'

export function removeAllDisconnectedDapps(): void {
    const client = getWalletClient()
    if (!client) {
        return
    }

    const connectedDappsForProfile = get(connectedDapps).filter(
        (dapp) => dapp.metadata?.url && !!getPersistedDappNamespacesForDapp(dapp.metadata.url) && !dapp.session
    )

    for (const dapp of connectedDappsForProfile) {
        if (dapp.metadata) {
            removeDappNamespacesForDapp(dapp.metadata.url)
        }
    }
}
