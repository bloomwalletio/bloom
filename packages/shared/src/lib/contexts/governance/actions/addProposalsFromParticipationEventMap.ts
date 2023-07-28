import type { ParticipationEventMap, ParticipationEventWithNodes } from '@iota/sdk'

import { IAccountState } from '@core/account/interfaces'

import { addOrUpdateProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '../utils'

export function addProposalsFromParticipationEventMap(eventMap: ParticipationEventMap, account: IAccountState): void {
    Object.values(eventMap).forEach((event: ParticipationEventWithNodes) => {
        const proposal = createProposalFromEvent(event)
        addOrUpdateProposalToRegisteredProposals(proposal, account.index)
    })
}
