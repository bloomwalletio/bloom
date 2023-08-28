import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/wallet/out/types'
import { IAccountState } from '@core/account/interfaces'

import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'
import { getSelectedAccount } from '@core/account/stores'

export async function registerParticipationEvents(
    registrationOptions: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    let newRegistrationOptions = registrationOptions
    const { removedProposalIds } = getSelectedAccount()
    if (removedProposalIds && removedProposalIds.length > 0) {
        newRegistrationOptions = {
            ...registrationOptions,
            eventsToIgnore: removedProposalIds ?? [],
        }
    }

    const eventMap = await account.registerParticipationEvents(newRegistrationOptions)
    addProposalsFromParticipationEventMap(eventMap, account)
    return eventMap
}
