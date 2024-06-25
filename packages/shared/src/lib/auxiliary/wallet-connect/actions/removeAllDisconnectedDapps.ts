import { connectedDapps, getWalletClient, setConnectedDapps } from '../stores'
import { get } from 'svelte/store'
import { clearOldPairings } from './clearOldPairings'

export function removeAllDisconnectedDapps(): void {
    const client = getWalletClient()
    if (!client) {
        return
    }

    const connectedDappsForProfile = get(connectedDapps).filter((dapp) => !dapp.session)
    for (const dapp of connectedDappsForProfile) {
        if (dapp.metadata) {
            void clearOldPairings(dapp.metadata.url)
        }
    }
    setConnectedDapps()
}
