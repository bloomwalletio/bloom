import { ActivityType } from '@core/activity/enums'
import { Activity } from '@core/activity/types'
import { localize } from '@core/i18n'
import { getLayer2NetworkFromAddress } from '@core/layer-2/actions'
import { truncateString } from '@core/utils'
import { SubjectType } from '@core/wallet/enums'
import type { Subject } from '@core/wallet/types'

export function getSubjectFromActivity(activity: Activity): Subject | undefined {
    if (activity.smartContract) {
        return {
            ...activity.subject,
            ...(activity.subject?.type === SubjectType.Address && {
                address: activity.smartContract?.ethereumAddress,
            }),
        }
    } else if (activity.subject?.type === SubjectType.Address) {
        const network = getLayer2NetworkFromAddress(activity.subject.address)
        return { ...activity.subject, address: network ?? activity.subject.address }
    } else {
        return activity.subject
    }
}

export function getSubjectLocaleFromActivity(activity: Activity): string {
    const { subject } = activity

    if (activity.type === ActivityType.Basic && activity?.isShimmerClaiming) {
        return localize('general.shimmerGenesis')
    } else if (subject?.type === SubjectType.Account) {
        return truncateString(subject.account?.name, 13, 0)
    } else if (subject?.type === SubjectType.Contact) {
        return truncateString(subject.contact?.name, 13, 0)
    } else if (subject?.type === SubjectType.Address) {
        const address = activity?.smartContract?.ethereumAddress ?? subject.address
        const network = getLayer2NetworkFromAddress(address)

        return network ?? truncateString(address, 6, 6)
    } else {
        return localize('general.unknownAddress')
    }
}
