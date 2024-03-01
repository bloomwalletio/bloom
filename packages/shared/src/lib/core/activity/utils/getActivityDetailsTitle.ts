import { localize } from '@core/i18n'
import { ActivityAction, ActivityDirection, ActivityType } from '../enums'
import { StardustActivity } from '../types'
import { getVotingEvent } from '@contexts/governance/actions'
import { truncateString } from '@core/utils'
import { getSubjectLocaleFromActivity } from './helper'

export async function getActivityDetailsTitle(activity: StardustActivity): Promise<string> {
    const localizationPrefix = 'popups.activityDetails.title'
    if (activity.type === ActivityType.Consolidation) {
        const key = `${localizationPrefix}.consolidation.${activity.inclusionState}`
        return localize(key)
    } else if (activity.type === ActivityType.Alias) {
        const key = `${localizationPrefix}.alias.creation.${activity.inclusionState}`
        return localize(key)
    } else if (activity.type === ActivityType.Governance) {
        let proposalName: string = ''
        if (activity?.participation?.eventId) {
            try {
                proposalName = (await getVotingEvent(activity.participation.eventId)).data.name
            } catch (err) {
                proposalName = truncateString(activity.participation?.eventId, 6, 6)
            }
        }
        const key = `${localizationPrefix}.governance.${activity.governanceAction}.${activity.inclusionState}`
        return localize(key, { proposalName })
    } else if (activity.action === ActivityAction.BalanceChange) {
        return localize(
            activity.direction === ActivityDirection.Outgoing ? 'general.balanceDecreased' : 'general.balanceIncreased'
        )
    } else if (activity.action === ActivityAction.InitialBalance) {
        return localize('general.initialBalance')
    } else if (activity.action === ActivityAction.Send) {
        const key = `${localizationPrefix}.${(activity.isInternal ? 'internal.' : 'external.') + activity.direction}.${
            activity.inclusionState
        }`
        const displayedSubject = getSubjectLocaleFromActivity(activity)

        return localize(key, { subject: displayedSubject })
    } else if (activity.action === ActivityAction.Mint || activity.action === ActivityAction.Burn) {
        const key = `${localizationPrefix}.${activity.action}.${activity.inclusionState}`
        const displayedSubject = getSubjectLocaleFromActivity(activity)

        return localize(key, { subject: displayedSubject })
    } else {
        const key = `${localizationPrefix}.fallback`
        return localize(key)
    }
}
