import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account/interfaces'
import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'
import { updateActiveAccountPersistedData } from '@core/profile/actions'

export async function registerParticipationEvents(
    registrationOptions: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    let newRegistrationOptions = registrationOptions
    let { removedProposalIds } = account
    const { eventsToIgnore, eventsToRegister } = registrationOptions ?? {}

    const forceAddingRemovedEvents = eventsToIgnore?.length === 0
    if (forceAddingRemovedEvents) {
        const addAllEvents = eventsToRegister?.length === 0
        if (addAllEvents) {
            removedProposalIds = []
        } else {
            removedProposalIds = removedProposalIds?.filter((id) => !eventsToRegister?.includes(id))
        }
        updateActiveAccountPersistedData(account.index, {
            removedProposalIds,
        })
    }

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
