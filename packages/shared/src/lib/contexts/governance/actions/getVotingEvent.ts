import { get } from 'svelte/store'
import { ParticipationEventId, ParticipationEventWithNodes } from '@iota/sdk/out/types'
import { selectedAccount } from '@core/account/stores'

export function getVotingEvent(eventId: ParticipationEventId): Promise<ParticipationEventWithNodes> {
    const account = get(selectedAccount)
    return account.getParticipationEvent(eventId)
}
