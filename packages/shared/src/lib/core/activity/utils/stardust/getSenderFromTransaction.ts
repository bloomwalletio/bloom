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
        const networkMetadata = getNetwork()?.getMetadata()
        if (networkMetadata) {
            return {
                type: SubjectType.Network,
                id: networkMetadata.id,
                name: networkMetadata.name,
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
