import { ActivityType } from '@core/activity/enums'
import { Activity } from '@core/activity/types'
import { localize } from '@core/i18n'
import { getLayer2NetworkFromAddress } from '@core/layer-2/actions'
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
    } else if (subject?.type === SubjectType.Address) {
        const network = getLayer2NetworkFromAddress(subject.address)
        return network ?? truncateString(subject.address, 6, 6)
    } else {
        return localize('general.unknownAddress')
    }
}

function getSubjectFromActivity(activity: Activity): Subject | undefined {
    if (activity.subject?.address && activity.smartContract?.ethereumAddress) {
        const network = getLayer2NetworkFromAddress(activity.subject.address)
        if (network) {
            return (
                getSubjectFromAddress(activity.smartContract.ethereumAddress, activity.destinationNetworkId) ??
                activity.subject
            )
        } else {
            return activity.subject
        }
    } else {
        return activity.subject
    }
}
