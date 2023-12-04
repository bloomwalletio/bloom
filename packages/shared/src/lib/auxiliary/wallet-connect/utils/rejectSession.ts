import { getSdkError } from '@walletconnect/utils'
import { getWalletClient, sessionProposal } from '../stores'
import { get } from 'svelte/store'

export async function rejectSession(): Promise<void> {
    const _sessionProposal = get(sessionProposal)
    if (!_sessionProposal) {
        return
    }

    sessionProposal.set(undefined)
    await getWalletClient()?.rejectSession({
        id: _sessionProposal.id,
        reason: getSdkError('USER_REJECTED'),
    })
}
