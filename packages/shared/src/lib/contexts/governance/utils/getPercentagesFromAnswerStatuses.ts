import { get } from 'svelte/store'
import { IProposal, IProposalAnswerPercentages, selectedProposal } from '..'
import { AnswerStatus } from '@iota/sdk'
import { networkStatus } from '@core/network/stores/network-status.store'
import { round } from '@core/utils/number'

export function getPercentagesFromAnswerStatuses(
    answerStatuses: AnswerStatus[],
    proposal: IProposal = get(selectedProposal)
): IProposalAnswerPercentages {
    if (!proposal) {
        return {}
    }

    const answerStatusesWithProjection = answerStatuses.map((answerStatus) => {
        return { ...answerStatus, projected: getProjectedVotesFromAnswerStatus(answerStatus, proposal) }
    })

    let totalVotes = 0
    let totalProjectedVotes = 0
    answerStatusesWithProjection.forEach((status) => {
        totalVotes += status.accumulated
        totalProjectedVotes += status.projected
    })
    if (totalVotes === 0 || Number.isNaN(totalVotes)) {
        return {}
    }

    let percentages: IProposalAnswerPercentages = {}
    answerStatusesWithProjection.forEach((answerStatus) => {
        if (answerStatus.value !== undefined) {
            percentages = {
                ...percentages,
                [answerStatus.value]: {
                    accumulated: getPercentageStringFromDivisionResult(answerStatus.accumulated / totalVotes),
                    projected: getPercentageStringFromDivisionResult(answerStatus.projected / totalProjectedVotes),
                },
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

function getPercentageStringFromDivisionResult(divisionResult: number): string {
    if (Number.isNaN(divisionResult)) {
        return '0%'
    } else {
        return round(divisionResult * 100, 1) + '%'
    }
}
