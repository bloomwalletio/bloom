import { getWalletClient } from '../stores'
import { setConnectedDapps } from '../stores/connected-dapps.store'

export async function pairWithNewDapp(uri: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        await client.core.pairing.pair({ uri })
        setConnectedDapps()
    } catch (e) {
        console.error('already connected')
    }
}
