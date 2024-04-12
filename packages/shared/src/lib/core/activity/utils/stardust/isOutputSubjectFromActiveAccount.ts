import { IAccountState } from '@core/account/interfaces'
import { StardustNetworkId } from '@core/network'
import { SubjectType } from '@core/wallet/enums'
import { getSubjectFromAddress } from '@core/wallet/utils'
import { CommonOutput } from '@iota/sdk/out/types'
import { getRecipientAddressFromOutput } from '../outputs'

export function isOutputSubjectFromActiveAccount(
    output: CommonOutput | undefined,
    activeAccount: IAccountState,
    networkId: StardustNetworkId
): boolean {
    if (output === undefined) {
        return false
    }
    const recipientAddress = getRecipientAddressFromOutput(output)

    if (recipientAddress === undefined) {
        return false
    }

    const subject = getSubjectFromAddress(recipientAddress, networkId)
    return subject?.type === SubjectType.Account && activeAccount.index === subject?.account.index
}
