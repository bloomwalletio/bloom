import { ActivityType } from '@core/activity/enums'
import { StardustActivity } from '@core/activity/types'
import { localize } from '@core/i18n'
import { truncateString } from '@core/utils'
import { SubjectType } from '@core/wallet/enums'

export function getSubjectLocaleFromActivity(activity: StardustActivity): string {
    const subject = activity.subject

    if (activity.type === ActivityType.Basic && activity?.isShimmerClaiming) {
        return localize('general.shimmerGenesis')
    } else if (subject?.type === SubjectType.Account) {
        return truncateString(subject.account?.name, 13, 0)
    } else if (subject?.type === SubjectType.Contact) {
        return truncateString(subject.contact?.name, 13, 0)
    } else if (subject?.type === SubjectType.SmartContract) {
        return truncateString(subject.name, 13, 0)
    } else if (subject?.type === SubjectType.Network) {
        return truncateString(subject.name, 13, 0)
    } else if (subject?.type === SubjectType.Address) {
        return truncateString(subject.address, 6, 6)
    } else {
        return localize('general.unknownAddress')
    }
}
