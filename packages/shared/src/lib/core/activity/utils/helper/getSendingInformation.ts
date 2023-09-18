import { IAccountState } from '@core/account'
import { ActivityDirection } from '@core/activity/enums'
import { IProcessedTransaction, SenderInfo } from '@core/activity/types'
import { NetworkId } from '@core/network'
import { Output } from '@core/wallet/types'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet/utils'
import { getSenderAddressFromInputs } from '../getSenderAddressFromInputs'
import { getSenderFromTransaction } from '../getSenderFromTransaction'
import { getRecipientFromOutput } from '../outputs'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: Output,
    account: IAccountState,
    networkId: NetworkId
): SenderInfo {
    const { direction, wrappedInputs } = processedTransaction

    const recipient = getRecipientFromOutput(output, networkId)
    const sender = wrappedInputs?.length
        ? getSubjectFromAddress(getSenderAddressFromInputs(wrappedInputs), networkId)
        : getSenderFromTransaction(output, direction === ActivityDirection.Incoming, account.depositAddress, networkId)

    const subject = direction === ActivityDirection.Incoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    return {
        sender,
        recipient,
        subject,
        isInternal,
    }
}
