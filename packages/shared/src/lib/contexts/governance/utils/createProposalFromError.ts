import { get } from 'svelte/store'
import { EventStatus } from '@iota/sdk/out/types'
import { networkStatus } from '@core/network/stores'
import { ProposalError } from '../enums'
import { IProposal, IProposalMetadata } from '../interfaces'
import { getProposalStatusForMilestone } from './getProposalStatusForMilestone'

export function createProposalFromError(
    proposal: IProposalMetadata,
    err: unknown | Record<string, unknown>
): IProposal {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
    if (isEventError) {
        const status = getProposalStatusForMilestone(get(networkStatus)?.currentMilestone, proposal.milestones)
        const isNodeOutdated = status !== EventStatus.Ended
        const error = isNodeOutdated ? ProposalError.NodeOutdated : ProposalError.ResultsNotAvailable
        return {
            ...proposal,
            status,
            error,
        }
    }
}
