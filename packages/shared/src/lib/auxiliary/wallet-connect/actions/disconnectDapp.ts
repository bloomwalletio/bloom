import { getWalletClient, setConnectedDapps } from '../stores'
import { getSdkError } from '@walletconnect/utils'
import { IConnectedDapp } from '../interface'
import { handleError } from '@core/error/handlers'

export async function disconnectDapp(dapp: IConnectedDapp): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        if (dapp.sessionTopic) {
            await client.disconnectSession({
                topic: dapp.sessionTopic,
                reason: getSdkError('USER_DISCONNECTED'),
            })
        }
    } catch (err) {
        handleError(err)
    } finally {
        setConnectedDapps()
    }
}
