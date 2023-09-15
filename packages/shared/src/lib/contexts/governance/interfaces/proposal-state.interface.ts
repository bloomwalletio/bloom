import { EventStatus, ParticipationEventStatus, Question } from '@iota/sdk/out/types'
import { IOrganization, ProposalError } from '..'
import { ProposalType } from '../enums'

export interface IProposal extends IProposalMetadata {
    status: EventStatus
}

export interface IProposalState {
    [proposalId: string]: {
        state: ParticipationEventStatus
    }
}

export interface IRegisteredProposals {
    [proposalId: string]: IProposalMetadata
}

export interface IProposalMetadata {
    id: string
    milestones?: Record<EventStatus, number>
    organization?: IOrganization
    type: ProposalType
    questions: Question[]
    additionalInfo: string
    title: string
    nodeUrl: string
    error?: ProposalError
}
