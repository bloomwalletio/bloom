import { getSubjectFromAddress } from '@core/wallet/utils'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { Output, Subject } from '@core/wallet/types'
import { StardustNetworkId } from '@core/network'

export function getRecipientFromOutput(output: Output, networkId: StardustNetworkId): Subject | undefined {
    const recipientAddress = getRecipientAddressFromOutput(output)
    return recipientAddress ? getSubjectFromAddress(recipientAddress, networkId) : undefined
}
