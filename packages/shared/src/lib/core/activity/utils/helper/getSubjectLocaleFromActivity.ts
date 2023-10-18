import { ActivityType } from '@core/activity/enums'
import { Activity } from '@core/activity/types'
import { localize } from '@core/i18n'
import { truncateString } from '@core/utils'
import { getSubjectFromAddress } from '@core/wallet'
import { SubjectType } from '@core/wallet/enums'
import type { Subject } from '@core/wallet/types'

export function getSubjectLocaleFromActivity(activity: Activity): string {
    const subject = getSubjectFromActivity(activity)

    if (activity.type === ActivityType.Basic && activity?.isShimmerClaiming) {
        return localize('general.shimmerGenesis')
    } else if (subject?.type === SubjectType.Account) {
        return truncateString(subject.account?.name, 13, 0)
    } else if (subject?.type === SubjectType.Contact) {
        return truncateString(subject.contact?.name, 13, 0)
    } else if (subject?.type === SubjectType.Network) {
        return truncateString(subject.name, 13, 0)
    } else if (subject?.type === SubjectType.Address) {
        return truncateString(subject.address, 6, 6)
    } else {
        return localize('general.unknownAddress')
    }
}

function getSubjectFromActivity(activity: Activity): Subject | undefined {
    if (activity.subject?.type === SubjectType.Network && activity.smartContract?.ethereumAddress) {
        return (
            getSubjectFromAddress(activity.smartContract.ethereumAddress, activity.destinationNetworkId) ??
            activity.subject
        )
    } else {
        return activity.subject
    }
}
