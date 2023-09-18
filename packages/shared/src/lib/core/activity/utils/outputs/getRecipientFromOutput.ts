import { NetworkId } from '@core/network'
import { Output, Subject } from '@core/wallet/types'
import { getSubjectFromAddress } from '@core/wallet/utils'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'

export function getRecipientFromOutput(output: Output, networkId: NetworkId): Subject {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return getSubjectFromAddress(recipientAddress, networkId)
}
