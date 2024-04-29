import { IRegisteredProposals, IProposalWithStatus, IProposal } from '../interfaces'
import { getProposalStatusForMilestone } from './getProposalStatusForMilestone'

export function getProposalsWithStatus(
    registeredProposals: IRegisteredProposals,
    currentMilestone: number
): IProposalWithStatus[] {
    return Object.values(registeredProposals).map((proposal) => getProposalWithStatus(proposal, currentMilestone))
}

export function getProposalWithStatus(proposal: IProposal, currentMilestone: number): IProposalWithStatus {
    return {
        ...proposal,
        status: getProposalStatusForMilestone(currentMilestone, proposal.milestones),
    }
}
