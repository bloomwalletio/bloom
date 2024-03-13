import { IProfile } from '@core/profile/interfaces'
import { activeProfile } from '@core/profile/stores'
import { calculatePercentageOfBigInt } from '@core/utils/number'
import { EventStatus, ParticipationEventStatus } from '@iota/sdk'
import { get } from 'svelte/store'
import { IProposal } from '../interfaces'

export function getCirculatingSupplyVotedPercentage(
    participationEventStatus: ParticipationEventStatus,
    proposal: IProposal,
    currentMilestone: number,
    profile: IProfile = get(activeProfile)
): number {
    const circulatingSupply = profile.network.protocol?.circulatingSupply
    if (!circulatingSupply || !participationEventStatus?.questions || !proposal?.milestones) {
        return 0
    }

    const totalEventVotes = getTotalEventVotes(participationEventStatus)
    const milestoneCount = getMilestoneCount(participationEventStatus, proposal.milestones, currentMilestone)

    const maximumVotes = BigInt(circulatingSupply) * BigInt(milestoneCount)
    const percentage = calculatePercentageOfBigInt(totalEventVotes, maximumVotes, 6)

    return percentage
}

function getTotalEventVotes(participationEventStatus: ParticipationEventStatus): bigint {
    const isCommencing = participationEventStatus.status === EventStatus.Commencing
    const participationQuestion = participationEventStatus.questions?.[0]

    if (!participationQuestion) {
        return BigInt(0)
    }

    const totalEventVotes = participationQuestion.answers.reduce(
        (total, answer) => (total += BigInt(answer[isCommencing ? 'current' : 'accumulated'])),
        BigInt(0)
    )

    return totalEventVotes
}

function getMilestoneCount(
    participationEventStatus: ParticipationEventStatus,
    proposalMilestones: Record<EventStatus, number>,
    currentMilestone: number
): number {
    switch (participationEventStatus.status) {
        case EventStatus.Holding:
            return Math.max(currentMilestone - proposalMilestones.holding, 1)
        case EventStatus.Ended:
            return Math.max(proposalMilestones.ended - proposalMilestones.holding, 1)
        default:
            return 1
    }
}
