import { getSdkError } from '@walletconnect/utils'
import { getWalletClient } from '../stores'
import { handleError } from '@core/error/handlers'

export async function rejectSessionInitiationRequest(
    sessionId: number,
    connectionType: 'session_proposal' | 'session_authenticate'
): Promise<void> {
    try {
        if (connectionType === 'session_proposal') {
            await getWalletClient()?.rejectSession({
                id: sessionId,
                reason: getSdkError('USER_REJECTED'),
            })
        } else if (connectionType === 'session_authenticate') {
            await getWalletClient()?.rejectSessionAuthenticate({
                id: sessionId,
                reason: getSdkError('USER_REJECTED'),
            })
        }
    } catch (err) {
        handleError(err)
    }
}
