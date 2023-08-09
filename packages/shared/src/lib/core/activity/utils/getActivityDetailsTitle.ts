import { localize } from '@core/i18n'
import { ActivityAction, ActivityType, SubjectType } from '../../wallet/enums'
import { Activity } from '../../wallet/types'
import { getVotingEvent } from '@contexts/governance/actions'
import { truncateString } from '@core/utils'
import { getSubjectFromActivity } from './generateActivity'

export async function getActivityDetailsTitle(activity: Activity): Promise<string> {
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
        return localize('general.balanceChanged')
    } else if (activity.action === ActivityAction.Send) {
        const key = `${localizationPrefix}.${(activity.isInternal ? 'internal.' : 'external.') + activity.direction}.${
            activity.inclusionState
        }`
        const displayedSubject = getDisplayedSubject(activity)

        return localize(key, { subject: displayedSubject })
    } else if (activity.action === ActivityAction.Mint || activity.action === ActivityAction.Burn) {
        const key = `${localizationPrefix}.${activity.action}.${activity.inclusionState}`
        const displayedSubject = getDisplayedSubject(activity)

        return localize(key, { subject: displayedSubject })
    } else {
        const key = `${localizationPrefix}.unknown`
        return localize(key)
    }
}

function getDisplayedSubject(_activity: Activity): string {
    const subject = getSubjectFromActivity(_activity)
    if (!subject) {
        return ''
    }

    if (subject.type === SubjectType.Contact) {
        return subject.contact.name
    } else if (subject.type === SubjectType.Account) {
        return subject.account.name
    } else {
        return truncateString(subject.address, 6, 6)
    }
}
