import { Output, Subject } from '@core/wallet/types'
import { getSenderFromOutput } from './outputs'
import { NetworkId } from '@core/network'
import { getSubjectFromAddress } from '@core/wallet'

export function getSenderFromTransaction(
    output: Output,
    isIncoming: boolean,
    accountAddress: string,
    networkId: NetworkId
): Subject | undefined {
    if (isIncoming) {
        return getSenderFromOutput(output, networkId)
    } else {
        return getSubjectFromAddress(accountAddress, networkId)
    }
}
