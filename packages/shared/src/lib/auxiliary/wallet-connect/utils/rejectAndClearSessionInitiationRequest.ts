import { clearSessionInitiationRequest, sessionInitiationRequest } from '../stores'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { get } from 'svelte/store'
import { rejectSessionInitiationRequest } from './rejectSessionInitiationRequest'

export async function rejectAndClearSessionInitiationRequest(): Promise<void> {
    const _sessionInitiationRequest = get(sessionInitiationRequest)
    if (!_sessionInitiationRequest) {
        return
    }

    const { id, params } = _sessionInitiationRequest

    const isExpired = (params.expiryTimestamp - Date.now()) / MILLISECONDS_PER_SECOND <= 0
    if (!isExpired) {
        await rejectSessionInitiationRequest(id)
    }
    clearSessionInitiationRequest()
}
