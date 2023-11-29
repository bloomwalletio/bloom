import { ParticipationEventId, ParticipationEventStatus } from '@iota/sdk/out/types'

import { IAccount } from '@core/account/interfaces'
import { getSelectedAccount } from '@core/account/stores'

export function getAccountsParticipationEventStatusForEvent(
    eventId: ParticipationEventId,
    account: IAccount = getSelectedAccount()
): Promise<ParticipationEventStatus> {
    return account?.getParticipationEventStatus(eventId)
}
