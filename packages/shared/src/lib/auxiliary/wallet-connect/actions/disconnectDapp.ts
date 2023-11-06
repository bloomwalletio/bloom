import { logAndNotifyError } from '@core/error/actions'
import { getWalletClient, setConnectedDapps } from '../stores'
import { getSdkError } from '@walletconnect/utils'
import { IConnectedDapp } from '../interface'

export async function disconnectDapp(dapp: IConnectedDapp): Promise<void> {
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
