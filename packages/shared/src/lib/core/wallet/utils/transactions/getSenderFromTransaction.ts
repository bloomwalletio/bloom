import { Output, Subject } from '@core/wallet/types'
import { getSenderFromOutput } from '../outputs/getSenderFromOutput'
import { SubjectType } from '@core/wallet/enums'

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
