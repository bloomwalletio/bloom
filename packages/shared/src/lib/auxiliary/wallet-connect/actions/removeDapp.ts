import { logAndNotifyError } from '@core/error/actions'
import { getWalletClient, setConnectedDapps } from '../stores'
import { getSdkError } from '@walletconnect/utils'
import { IConnectedDapp } from '../interface'

export async function removeDapp(dapp: IConnectedDapp): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        if (dapp.session) {
            await client.disconnectSession({
                topic: dapp.session.topic,
                reason: getSdkError('USER_DISCONNECTED'),
            })
        }
        await client.core.pairing.disconnect({ topic: dapp.topic })
        setConnectedDapps()
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
