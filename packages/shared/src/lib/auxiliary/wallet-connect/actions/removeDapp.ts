import { logAndNotifyError } from '@core/error/actions'
import { getWalletClient, setConnectedDapps } from '../stores'
import { IConnectedDapp } from '../interface'

export async function removeDapp(dapp: IConnectedDapp): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
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
