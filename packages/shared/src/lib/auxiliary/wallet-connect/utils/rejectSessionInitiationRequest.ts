import { getSdkError } from '@walletconnect/utils'
import { getWalletClient } from '../stores'
import { handleError } from '@core/error/handlers'
import { SessionInitiationType } from '../enums'

export async function rejectSessionInitiationRequest(
    sessionId: number,
    connectionType: SessionInitiationType
): Promise<void> {
    try {
        if (connectionType === SessionInitiationType.SessionProposal) {
            await getWalletClient()?.rejectSession({
                id: sessionId,
                reason: getSdkError('USER_REJECTED'),
            })
        } else if (connectionType === SessionInitiationType.SessionAuthenticate) {
            await getWalletClient()?.rejectSessionAuthenticate({
                id: sessionId,
                reason: getSdkError('USER_REJECTED'),
            })
        }
    } catch (err) {
        handleError(err)
    }
}
