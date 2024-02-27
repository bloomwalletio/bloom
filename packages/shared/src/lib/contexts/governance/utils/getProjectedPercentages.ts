import { get } from 'svelte/store'
import { IProposal, IProposalAnswerPercentages, selectedProposal } from '..'
import { AnswerStatus } from '@iota/sdk'
import { networkStatus } from '@core/network/stores/network-status.store'
import { round } from '@core/utils/number'

export function getProjectedPercentages(
    answerStatuses: AnswerStatus[],
    proposal: IProposal = get(selectedProposal)
): IProposalAnswerPercentages {
    if (!proposal) {
        return {}
    }

    const answerStatusesWithProjection = answerStatuses.map((answerStatus) => {
        return { ...answerStatus, projected: getProjectedVotesFromAnswerStatus(answerStatus, proposal) }
    })

    const totalVotes = answerStatusesWithProjection?.reduce((acc, answerStatus) => acc + answerStatus.projected, 0) ?? 0
    if (totalVotes === 0 || Number.isNaN(totalVotes)) {
        return {}
    }

    let percentages: IProposalAnswerPercentages = {}
    answerStatusesWithProjection.forEach((answerStatus) => {
        if (answerStatus.value !== undefined) {
            const divisionResult = (answerStatus.projected ?? 0) / totalVotes
            percentages = {
                ...percentages,
                [answerStatus.value]: Number.isNaN(divisionResult) ? '0%' : `${round(divisionResult * 100, 1)}%`,
            }
        }
    })

    return percentages
}

function getProjectedVotesFromAnswerStatus(answerStatus: AnswerStatus, proposal: IProposal): number {
    const { accumulated, current } = answerStatus
    const endingMilestone = proposal.milestones?.ended ?? 0
    const currentMilestone = get(networkStatus)?.currentMilestone ?? 0

    return Math.max(accumulated, accumulated + current * (endingMilestone - currentMilestone))
}
