import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { participationOverviewForSelectedAccount } from '../stores/participation-overviews.store'

export function getActiveParticipation(proposalId: string): TrackedParticipationOverview | undefined {
    const overview = get(participationOverviewForSelectedAccount)
    const participationsForProposal: TrackedParticipationOverview[] = Object.values(
        overview?.participations?.[proposalId] ?? {}
    )
    return participationsForProposal.find((participation) => participation?.endMilestoneIndex === 0)
}
