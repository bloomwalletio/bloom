import { getWalletClient } from '../stores'
import { handleError } from '@core/error/handlers'

export async function pairWithNewDapp(uri: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        await client.core.pairing.pair({ uri })
    } catch (err) {
        handleError(err)
    }
}
