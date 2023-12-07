import { getSdkError } from '@walletconnect/utils'
import { getWalletClient, sessionProposal } from '../stores'
import { get } from 'svelte/store'
import { handleError } from '@core/error/handlers'

export async function rejectSession(): Promise<void> {
    const _sessionProposal = get(sessionProposal)
    if (!_sessionProposal) {
        return
    }

    sessionProposal.set(undefined)
    try {
        await getWalletClient()?.rejectSession({
            id: _sessionProposal.id,
            reason: getSdkError('USER_REJECTED'),
        })
    } catch (err) {
        handleError(err)
    }
}
