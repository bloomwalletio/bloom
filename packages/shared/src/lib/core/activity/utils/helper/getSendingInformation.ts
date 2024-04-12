import { IAccountState } from '@core/account'
import { Output } from '@core/wallet/types'
import { getRecipientFromOutput } from '../outputs'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet/utils'
import { getSenderAddressFromInputs } from '../stardust/getSenderAddressFromInputs'
import { getSenderFromTransaction } from '../stardust/getSenderFromTransaction'
import { ActivityDirection } from '@core/activity/enums'
import { IProcessedTransaction, SenderInfo } from '@core/activity/types'
import { StardustNetworkId } from '@core/network'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: Output,
    account: IAccountState,
    networkId: StardustNetworkId
): SenderInfo {
    const { direction, wrappedInputs } = processedTransaction

    const recipient = getRecipientFromOutput(output, networkId)
    const sender = wrappedInputs?.length
        ? getSubjectFromAddress(getSenderAddressFromInputs(wrappedInputs) ?? '', networkId)
        : getSenderFromTransaction(output, direction, account.depositAddress, networkId)

    const subject =
        direction === ActivityDirection.Incoming || direction === ActivityDirection.Genesis ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    return {
        sender,
        recipient,
        subject,
        isInternal,
    }
}
