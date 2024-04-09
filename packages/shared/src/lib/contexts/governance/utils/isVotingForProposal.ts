import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { selectedAccountIndex } from '@core/account/stores'
import { getParticipationsForProposal } from './getParticipationsForProposal'

export function isVotingForProposal(proposalId: string | undefined, accountIndex = get(selectedAccountIndex)): boolean {
    if (!proposalId) {
        return false
    }
    const participations = getParticipationsForProposal(proposalId, accountIndex) ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
