import { Output, Subject } from '@core/wallet/types'
import { SubjectType } from '@core/wallet/enums'
import { getSenderFromOutput } from './outputs'
import { NetworkId } from '@core/network'

export function getSenderFromTransaction(
    output: Output,
    isIncoming: boolean,
    accountAddress: string,
    networkId: NetworkId
): Subject | undefined {
    if (isIncoming) {
        return getSenderFromOutput(output, networkId)
    } else {
        return { type: SubjectType.Address, address: accountAddress }
    }
}
