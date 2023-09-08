import { EventStatus } from '@iota/sdk/out/types'
import { ProposalPhaseOrdering } from '../types'

export const PROPOSAL_PHASE_ORDERING: ProposalPhaseOrdering = {
    [EventStatus.Upcoming]: 0,
    [EventStatus.Commencing]: 1,
    [EventStatus.Holding]: 2,
    [EventStatus.Ended]: 3,
}
