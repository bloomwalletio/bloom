import { Output, Subject } from '@core/wallet/types'
import { SubjectType } from '@core/wallet/enums'
import { getSenderFromOutput } from './outputs'

export function getSenderFromTransaction(
    isIncoming: boolean,
    accountAddress: string,
    output: Output
): Subject | undefined {
    if (isIncoming) {
        return getSenderFromOutput(output)
    } else {
        return { type: SubjectType.Address, address: accountAddress }
    }
}
