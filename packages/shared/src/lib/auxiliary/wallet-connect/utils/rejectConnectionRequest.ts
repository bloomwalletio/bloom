import { getSdkError } from '@walletconnect/utils'
import { getWalletClient, sessionInitiationRequest } from '../stores'
import { get } from 'svelte/store'
import { handleError } from '@core/error/handlers'

export async function rejectConnectionRequest(): Promise<void> {
    const _connectionRequest = get(sessionInitiationRequest)
    if (!_connectionRequest) {
        return
    }

    sessionInitiationRequest.set(undefined)
    try {
        if (_connectionRequest.type === 'session_proposal') {
            await getWalletClient()?.rejectSession({
                id: _connectionRequest.payload.id,
                reason: getSdkError('USER_REJECTED'),
            })
        } else if (_connectionRequest.type === 'session_authenticate') {
            await getWalletClient()?.rejectSessionAuthenticate({
                id: _connectionRequest.payload.id,
                reason: getSdkError('USER_REJECTED'),
            })
        }
    } catch (err) {
        handleError(err)
    }
}
