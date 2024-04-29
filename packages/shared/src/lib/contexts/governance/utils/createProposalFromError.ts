import { get } from 'svelte/store'
import { EventStatus } from '@iota/sdk/out/types'
import { getL1Network } from '@core/network/stores'
import { ProposalError } from '../enums'
import { IProposal } from '../interfaces'
import { getProposalStatusForMilestone } from './getProposalStatusForMilestone'

export function createProposalFromError(
    proposal: IProposal,
    err: unknown | Record<string, unknown>
): IProposal | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
    if (isEventError) {
        const currentMilestone = get(getL1Network().currentMilestone)
        const status = getProposalStatusForMilestone(currentMilestone, proposal.milestones)
        const isNodeOutdated = status !== EventStatus.Ended
        const error = isNodeOutdated ? ProposalError.NodeOutdated : ProposalError.ResultsNotAvailable
        return {
            ...proposal,
            error,
        }
    }
    return undefined
}
