import { logAndNotifyError } from '@core/error/actions'
import { getWalletClient } from '../stores'

export async function pairWithNewDapp(uri: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        await client.core.pairing.pair({ uri })
    } catch (err) {
        logAndNotifyError({
            type: 'walletConnect',
            message: String(err),
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: false,
        })
    }
}
