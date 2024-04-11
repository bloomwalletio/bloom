import { Output, Subject } from '@core/wallet/types'
import { getSenderFromOutput } from '../outputs'
import { NetworkId, getNetwork } from '@core/network'
import { EMPTY_HEX_ID, SubjectType, getSubjectFromAddress } from '@core/wallet'
import { ActivityDirection } from '../../enums'

export function getSenderFromTransaction(
    output: Output,
    direction: ActivityDirection,
    accountAddress: string,
    networkId: NetworkId
): Subject | undefined {
    if (direction === ActivityDirection.Genesis) {
        const network = getNetwork()
        if (network) {
            return {
                type: SubjectType.Network,
                id: network.id,
                name: network.name,
                address: EMPTY_HEX_ID,
            }
        }
    }

    if (direction === ActivityDirection.Incoming) {
        return getSenderFromOutput(output, networkId)
    } else {
        return getSubjectFromAddress(accountAddress, networkId)
    }
}
