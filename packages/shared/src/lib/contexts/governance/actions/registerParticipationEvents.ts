import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account/interfaces'
import { getSelectedAccount } from '@core/account/stores'
import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'

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
