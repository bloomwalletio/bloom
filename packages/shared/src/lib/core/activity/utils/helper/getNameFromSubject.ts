import { localize } from '@core/i18n'
import { truncateString } from '@core/utils'
import { Subject } from '@core/wallet'
import { SubjectType } from '@core/wallet/enums'

export function getNameFromSubject(subject: Subject | undefined, isShimmerGenesis?: boolean): string {
    if (isShimmerGenesis) {
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