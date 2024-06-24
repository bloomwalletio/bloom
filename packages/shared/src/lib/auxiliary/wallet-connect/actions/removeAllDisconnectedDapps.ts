import { connectedDapps, getWalletClient, removePersistedDapp } from '../stores'
import { get } from 'svelte/store'

export function removeAllDisconnectedDapps(): void {
    const client = getWalletClient()
    if (!client) {
        return
    }

    // TODO: which dapps should be disconnected here
    // const connectedDappsForProfile = get(connectedDapps).filter(
    //     (dapp) => !!getPersistedDapp(dapp.metadata?.url ?? '') && !dapp.session
    // )

    const connectedDappsForProfile = get(connectedDapps)
    for (const dapp of connectedDappsForProfile) {
        if (dapp.metadata) {
            removePersistedDapp(dapp.metadata.url)
        }
    }
}
