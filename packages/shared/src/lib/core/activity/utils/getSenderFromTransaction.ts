import { NetworkId } from '@core/network'
import { SubjectType } from '@core/wallet/enums'
import { Output, Subject } from '@core/wallet/types'
import { getSenderFromOutput } from './outputs'

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
