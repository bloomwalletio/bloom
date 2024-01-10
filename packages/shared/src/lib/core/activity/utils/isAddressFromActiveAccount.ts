import { IAccountState } from '@core/account/interfaces'
import { NetworkId } from '@core/network'
import { SubjectType } from '@core/wallet/enums'
import { getSubjectFromAddress } from '@core/wallet/utils'

export function isAddressFromActiveAccount(
    address: string | undefined,
    activeAccount: IAccountState,
    network: NetworkId
): boolean {
    if (address === undefined) {
        return false
    }

    const subject = getSubjectFromAddress(address, network)
    return subject?.type === SubjectType.Account && activeAccount.index === subject?.account.index
}
