import { getWalletClient, setConnectedDapps } from '../stores'
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
        await client.core.pairing.disconnect({ topic: dapp.topic })
        setConnectedDapps()
    } catch (err) {
        handleError(err)
    }
}
