import { getWalletClient, removeDappNamespacesForDapp, setConnectedDapps } from '../stores'
import { getSdkError } from '@walletconnect/utils'
import { IConnectedDapp } from '../interface'
import { handleError } from '@core/error/handlers'

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
        if (dapp.metadata) {
            removeDappNamespacesForDapp(dapp.metadata.url)
        }
        setConnectedDapps()
    } catch (err) {
        handleError(err)
    }
}
