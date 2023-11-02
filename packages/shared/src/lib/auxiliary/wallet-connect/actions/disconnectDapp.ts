import { logAndNotifyError } from '@core/error/actions'
import { getWalletClient } from '../stores'
import { getSdkError } from '@walletconnect/utils'

export async function disconnectDapp(topic: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        const sessionIdForPairing = Object.values(client.getActiveSessions()).find(
            (session) => session.pairingTopic === topic
        )?.topic
        if (sessionIdForPairing) {
            await client.disconnectSession({
                topic: sessionIdForPairing,
                reason: getSdkError('USER_DISCONNECTED'),
            })
        }
        await client.core.pairing.disconnect({ topic })
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
