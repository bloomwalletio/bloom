import { IAccountState } from '@core/account/interfaces'
import { NetworkId } from '@core/network'
import { SubjectType } from '@core/wallet/enums'
import { getSubjectFromAddress } from '@core/wallet/utils'
import { CommonOutput } from '@iota/sdk/out/types'
import { getRecipientAddressFromOutput } from './outputs'

export function isOutputSubjectFromActiveAccount(
    output: CommonOutput | undefined,
    activeAccount: IAccountState,
    network: NetworkId
): boolean {
    if (output === undefined) {
        return false
    }
    const recipientAddress = getRecipientAddressFromOutput(output)

    if (recipientAddress === undefined) {
        return false
    }

    const subject = getSubjectFromAddress(recipientAddress, network)
    return subject?.type === SubjectType.Account && activeAccount.index === subject?.account.index
}
