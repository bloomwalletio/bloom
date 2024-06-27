import { getWalletClient, removePersistedDapp, setConnectedDapps } from '../stores'
import { IConnectedDapp } from '../interface'
import { disconnectDapp } from './disconnectDapp'

export async function removeDapp(dapp: IConnectedDapp): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    await disconnectDapp(dapp)
    if (dapp.metadata) {
        removePersistedDapp(dapp.metadata.url)
    }
    setConnectedDapps()
}
