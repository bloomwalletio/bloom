import { localize } from '@core/i18n'
import { truncateString } from '@core/utils'
import { Subject } from '@core/wallet'
import { SubjectType } from '@core/wallet/enums'

export function getNameFromSubject(
    subject: Subject | undefined,
    truncate: boolean = false,
    isShimmerGenesis?: boolean
): string {
    let name = ''
    if (isShimmerGenesis) {
        return localize('general.shimmerGenesis')
    } else if (subject?.type === SubjectType.Account) {
        name = subject.account?.name
    } else if (subject?.type === SubjectType.Contact) {
        name = subject.contact?.name
    } else if (subject?.type === SubjectType.SmartContract) {
        name = subject.name ?? subject.address
    } else if (subject?.type === SubjectType.Network) {
        name = subject.name
    } else if (subject?.type === SubjectType.Address) {
        name = subject.address
    } else {
        return localize('general.unknownAddress')
    }

    if (!truncate) {
        return name
    }

    return subject?.type === SubjectType.Address ? truncateString(name, 6, 6) : truncateString(name, 13, 0)
}
