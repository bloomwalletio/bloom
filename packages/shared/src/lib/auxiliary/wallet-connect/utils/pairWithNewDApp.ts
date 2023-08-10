import { getWalletClient } from '../stores'
import { setDAppPairings } from '../stores/dapp-pairings.store'

export async function pairWithNewApp(uri: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        await client.core.pairing.pair({ uri })
        setDAppPairings()
    } catch (e) {
        console.error('already connected')
    }
}
