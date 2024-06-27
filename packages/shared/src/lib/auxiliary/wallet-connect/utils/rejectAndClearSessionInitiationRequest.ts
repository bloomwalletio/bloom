import { clearSessionInitiationRequest, sessionInitiationRequest } from '../stores'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { get } from 'svelte/store'
import { rejectSessionInitiationRequest } from './rejectSessionInitiationRequest'

export async function rejectAndClearSessionInitiationRequest(): Promise<void> {
    const _sessionInitiationRequest = get(sessionInitiationRequest)
    if (!_sessionInitiationRequest) {
        return
    }

    const { id, params } = _sessionInitiationRequest.payload

    const isExpired = params.expiryTimestamp * MILLISECONDS_PER_SECOND - Date.now() <= 0
    if (!isExpired) {
        await rejectSessionInitiationRequest(id, _sessionInitiationRequest.type)
    }
    clearSessionInitiationRequest()
}
