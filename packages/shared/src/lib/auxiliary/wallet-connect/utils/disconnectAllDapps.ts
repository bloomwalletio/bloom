import { getWalletClient } from '../stores'
import { getSdkError } from '@walletconnect/utils'

export async function disconnectAllDapps(): Promise<void> {
    const pairings = getWalletClient()?.core.pairing.getPairings() ?? []
    for (const pairing of pairings) {
        await getWalletClient()?.disconnectSession({
            topic: pairing.topic,
            reason: getSdkError('USER_DISCONNECTED'),
        })
    }
}
