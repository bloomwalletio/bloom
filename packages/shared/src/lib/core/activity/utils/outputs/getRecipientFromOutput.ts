import { getSubjectFromAddress } from '@core/wallet/utils'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { Output, Subject } from '@core/wallet/types'

export function getRecipientFromOutput(output: Output): Subject | undefined {
    const recipientAddress = getRecipientAddressFromOutput(output)
    if (recipientAddress) {
        return getSubjectFromAddress(recipientAddress)
    }
}
