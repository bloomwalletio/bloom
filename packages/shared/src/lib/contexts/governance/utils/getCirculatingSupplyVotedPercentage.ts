import { IProfile } from '@core/profile/interfaces'
import { activeProfile } from '@core/profile/stores'
import { calculatePercentageOfBigInt } from '@core/utils/number'
import { ParticipationEventStatus } from '@iota/sdk'
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

    let milestoneCount: number
    if (currentMilestone < proposal.milestones.holding) {
        milestoneCount = 1
    } else if (currentMilestone > proposal.milestones.ended) {
        milestoneCount = proposal.milestones.ended - proposal.milestones.holding
    } else {
        milestoneCount = currentMilestone - proposal.milestones.holding
    }
    const totalEventVotes = participationEventStatus.questions[0].answers.reduce(
        (total, answer) => (total += BigInt(answer.accumulated)),
        BigInt(0)
    )
    const maximumVotes = BigInt(circulatingSupply) * BigInt(milestoneCount)

    const percentage = calculatePercentageOfBigInt(totalEventVotes, maximumVotes, 6)

    return percentage
}
