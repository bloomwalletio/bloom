import { IAccountState } from '@core/account'
import { Output, SenderInfo } from '@core/wallet/types'
import { getRecipientFromOutput } from '../outputs'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet/utils'
import { getSenderAddressFromInputs } from '../getSenderAddressFromInputs'
import { getSenderFromTransaction } from '../getSenderFromTransaction'
import { ActivityDirection } from '@core/activity/enums'
import { IProcessedTransaction } from '@core/activity/types'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: Output,
    account: IAccountState
): SenderInfo {
    const { direction, wrappedInputs } = processedTransaction

    const recipient = getRecipientFromOutput(output)
    const sender = wrappedInputs?.length
        ? getSubjectFromAddress(getSenderAddressFromInputs(wrappedInputs))
        : getSenderFromTransaction(direction === ActivityDirection.Incoming, account.depositAddress, output)

    const subject = direction === ActivityDirection.Incoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    return {
        subject,
        isInternal,
    }
}
