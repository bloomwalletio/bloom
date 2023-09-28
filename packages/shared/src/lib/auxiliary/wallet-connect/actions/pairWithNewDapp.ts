import { getWalletClient } from '../stores'

export async function pairWithNewDapp(uri: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        await client.core.pairing.pair({ uri })
    } catch (err) {
        console.error('already connected', err)
        throw err
    }
}
