import { get } from 'svelte/store'

import type { ParticipationEventId, ParticipationEventType } from '@iota/sdk'

import { selectedAccount } from '@core/account/stores'
import { INode } from '@core/network/interfaces'

export function getVotingParticipationEventIds(node: INode): Promise<ParticipationEventId[]> {
    return get(selectedAccount)?.getParticipationEventIds(node, ParticipationEventType.Voting)
}
