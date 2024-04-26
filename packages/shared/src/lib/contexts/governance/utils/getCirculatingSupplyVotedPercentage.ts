import { IProfile } from '@core/profile/interfaces'
import { activeProfile } from '@core/profile/stores'
import { calculatePercentageOfBigInt } from '@core/utils/number'
import { EventStatus, ParticipationEventStatus } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { IProposalWithStatus } from '../interfaces'

export function getCirculatingSupplyVotedPercentage(
    participationEventStatus: ParticipationEventStatus,
    proposal: IProposalWithStatus,
    currentMilestone: number,
    profile: IProfile = get(activeProfile)
): { actualPercentage: number; projectedPercentage: number } {
    const circulatingSupply = profile.network.protocol?.circulatingSupply
    if (!circulatingSupply || !participationEventStatus?.questions || !proposal?.milestones) {
        return { actualPercentage: 0, projectedPercentage: 0 }
    }
    const { totalCurrentVotes, totalAccumulatedVotes } = getTotalEventVotes(participationEventStatus)
    const { elapsedMilestones, remainingMilestones } = getMilestoneCount(
        participationEventStatus,
        proposal.milestones,
        currentMilestone
    )

    const maximumAccumulatedVotes = (BigInt(circulatingSupply) * BigInt(elapsedMilestones)) / BigInt(1000) // Divide by 1000 because 1000 microns = 1 vote
    const maximumRemainingVotes = (BigInt(circulatingSupply) * BigInt(remainingMilestones)) / BigInt(1000) // Divide by 1000 because 1000 microns = 1 vote

    const actualPercentage = calculatePercentageOfBigInt(totalAccumulatedVotes, maximumAccumulatedVotes, 6)
    const projectedPercentage = calculatePercentageOfBigInt(
        totalAccumulatedVotes + totalCurrentVotes * BigInt(remainingMilestones),
        maximumAccumulatedVotes + maximumRemainingVotes,
        6
    )
    return { actualPercentage, projectedPercentage }
}

function getTotalEventVotes(participationEventStatus: ParticipationEventStatus): {
    totalCurrentVotes: bigint
    totalAccumulatedVotes: bigint
} {
    const participationQuestion = participationEventStatus.questions?.[0]

    if (!participationQuestion) {
        return { totalCurrentVotes: BigInt(0), totalAccumulatedVotes: BigInt(0) }
    }

    const totalCurrentVotes = participationQuestion.answers.reduce(
        (total, answer) => (total += BigInt(answer.current)),
        BigInt(0)
    )

    const totalAccumulatedVotes = participationQuestion.answers.reduce(
        (total, answer) => (total += BigInt(answer.accumulated)),
        BigInt(0)
    )

    return { totalCurrentVotes, totalAccumulatedVotes }
}

function getMilestoneCount(
    participationEventStatus: ParticipationEventStatus,
    proposalMilestones: Record<EventStatus, number>,
    currentMilestone: number
): { elapsedMilestones: number; remainingMilestones: number } {
    let elapsedMilestones = 0
    let remainingMilestones = 0
    switch (participationEventStatus.status) {
        case EventStatus.Upcoming: // Announcement
            elapsedMilestones = 0
            remainingMilestones = Math.max(proposalMilestones.ended - proposalMilestones.holding, 0)
            break
        case EventStatus.Commencing: // Voting Open
            elapsedMilestones = 0
            remainingMilestones = Math.max(proposalMilestones.ended - proposalMilestones.holding, 0)
            break
        case EventStatus.Holding: // Counting
            elapsedMilestones = Math.max(currentMilestone - proposalMilestones.holding, 1)
            remainingMilestones = Math.max(proposalMilestones.ended - currentMilestone, 0)
            break
        case EventStatus.Ended: // Results
            elapsedMilestones = Math.max(proposalMilestones.ended - proposalMilestones.holding, 1)
            remainingMilestones = 0
            break
        default:
            elapsedMilestones = 1
            break
    }
    return { elapsedMilestones, remainingMilestones }
}
