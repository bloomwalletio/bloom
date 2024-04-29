import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { getL1Network } from '@core/network/stores'
import { MILESTONE_NOT_FOUND } from '@core/network/constants'

export function calculateTotalVotesForTrackedParticipations(
    trackedParticipations: TrackedParticipationOverview[]
): bigint {
    const currentMilestone = get(getL1Network().currentMilestone)
    if (currentMilestone === MILESTONE_NOT_FOUND) {
        return BigInt(0)
    } else {
        const votes = trackedParticipations.map((participation) =>
            calculateVotesInTrackedParticipation(participation, currentMilestone)
        )
        const totalVotes = votes?.reduce((accumulator, votes) => accumulator + votes, BigInt(0))
        return totalVotes ?? BigInt(0)
    }
}

function calculateVotesInTrackedParticipation(
    trackedParticipation: TrackedParticipationOverview,
    currentMilestone: number
): bigint {
    const { amount, startMilestoneIndex, endMilestoneIndex } = trackedParticipation
    const endMilestone = endMilestoneIndex === 0 ? currentMilestone : endMilestoneIndex
    const range = BigInt(endMilestone - startMilestoneIndex)
    return range > 0 ? BigInt(amount) * range : BigInt(amount)
}
