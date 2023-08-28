import type { ParticipationEventId, ParticipationEventWithNodes } from '@iota/wallet'
import { getSelectedAccount } from '@core/account/stores'

export function getVotingEvent(eventId: ParticipationEventId): Promise<ParticipationEventWithNodes> {
    const account = getSelectedAccount()
    return account.getParticipationEvent(eventId)
}
