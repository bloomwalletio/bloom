import { getSdkError } from '@walletconnect/utils'
import { getWalletClient } from '../stores'
import { handleError } from '@core/error/handlers'

export async function rejectSessionInitiationRequest(sessionId: number): Promise<void> {
    try {
        await getWalletClient()?.rejectSession({
            id: sessionId,
            reason: getSdkError('USER_REJECTED'),
        })
    } catch (err) {
        handleError(err)
    }
}
