import { EventStatus, ParticipationEventStatus, Question } from '@iota/sdk/out/types'
import { IOrganization, ProposalError } from '..'
import { ProposalType } from '../enums'

export interface IProposalWithStatus extends IProposal {
    status: EventStatus
}

export interface IProposalState {
    [proposalId: string]: {
        state: ParticipationEventStatus
    }
}

export interface IRegisteredProposals {
    [proposalId: string]: IProposal
}

export interface IProposal {
    id: string
    milestones: Record<EventStatus, number>
    organization?: IOrganization
    type: ProposalType
    questions: Question[]
    additionalInfo: string
    title: string
    nodeUrl: string
    error?: ProposalError
}
