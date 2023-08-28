import { NetworkId } from '@core/network'
import { UNLOCK_CONDITION_EXPIRATION, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '@core/wallet/constants'
import { Output, Subject } from '@core/wallet/types'
import { getBech32AddressFromAddressTypes, getSubjectFromAddress } from '@core/wallet/utils'

export function getSenderFromOutput(output: Output, networkId: NetworkId): Subject | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (
            unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN ||
            unlockCondition?.type === UNLOCK_CONDITION_EXPIRATION
        ) {
            return getSubjectFromAddress(getBech32AddressFromAddressTypes(unlockCondition?.returnAddress), networkId)
        }
    }
}
