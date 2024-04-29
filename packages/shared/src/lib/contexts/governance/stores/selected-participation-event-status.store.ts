import { ParticipationEventStatus } from '@iota/sdk/out/types'
import { get, writable } from 'svelte/store'
import { selectedAccountIndex } from '@core/account/stores'
import { getAccountsParticipationEventStatusForEvent } from '../actions'
import { createProposalFromError } from '../utils'
import { addOrUpdateProposalToRegisteredProposals, registeredProposals } from './registered-proposals.store'

export const selectedParticipationEventStatus = writable<ParticipationEventStatus | undefined>(undefined)

export async function getAndSetSelectedParticipationEventStatus(eventId: string): Promise<void> {
    let eventStatus: ParticipationEventStatus | undefined = undefined
    try {
        eventStatus = await getAccountsParticipationEventStatusForEvent(eventId)
    } catch (err) {
        const accountIndex = get(selectedAccountIndex)
        const proposal = get(registeredProposals)?.[accountIndex]?.[eventId]
        if (!proposal) {
            return
        }

        const errorProposal = createProposalFromError(proposal, err)
        if (errorProposal) {
            addOrUpdateProposalToRegisteredProposals(errorProposal, accountIndex)
        }
    }
    selectedParticipationEventStatus.set(eventStatus)
}

export function clearSelectedParticipationEventStatus(): void {
    selectedParticipationEventStatus.set(undefined)
}
