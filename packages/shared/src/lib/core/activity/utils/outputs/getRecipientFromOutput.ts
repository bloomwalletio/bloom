import { getSubjectFromAddress } from '@core/wallet/utils'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { Output, Subject } from '@core/wallet/types'
import { NetworkId } from '@core/network'

export function getRecipientFromOutput(output: Output, networkId: NetworkId): Subject {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return getSubjectFromAddress(recipientAddress, networkId)
}
