import { connectedDapps, getPersistedDappNamespacesForDapp, getWalletClient } from '../stores'
import { get } from 'svelte/store'
import { removeDapp } from './removeDapp'

export async function removeAllDisconnectedDapps(): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    const connectedDappsForProfile = get(connectedDapps).filter(
        (dapp) => dapp.metadata?.url && !!getPersistedDappNamespacesForDapp(dapp.metadata.url) && !dapp.session
    )

    for (const dapp of connectedDappsForProfile) {
        await removeDapp(dapp)
    }
}
