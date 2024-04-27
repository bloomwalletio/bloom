import { connectedDapps, getWalletClient, getPersistedDapp, removePersistedDapp } from '../stores'
import { get } from 'svelte/store'

export function removeAllDisconnectedDapps(): void {
    const client = getWalletClient()
    if (!client) {
        return
    }

    const connectedDappsForProfile = get(connectedDapps).filter(
        (dapp) => !!getPersistedDapp(dapp.metadata?.url ?? '') && !dapp.session
    )

    for (const dapp of connectedDappsForProfile) {
        if (dapp.metadata) {
            removePersistedDapp(dapp.metadata.url)
        }
    }
}
