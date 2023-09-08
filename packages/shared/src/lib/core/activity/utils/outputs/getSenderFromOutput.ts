import {
    ExpirationUnlockCondition,
    StorageDepositReturnUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { NetworkId } from '@core/network'
import { Output, Subject } from '@core/wallet/types'
import { getBech32AddressFromAddressTypes, getSubjectFromAddress } from '@core/wallet/utils'

export function getSenderFromOutput(output: Output, networkId: NetworkId): Subject | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (
            unlockCondition.type === UnlockConditionType.StorageDepositReturn ||
            unlockCondition.type === UnlockConditionType.Expiration
        ) {
            const storageOrExpirationUnlockCondition = unlockCondition as
                | StorageDepositReturnUnlockCondition
                | ExpirationUnlockCondition

            const address = getBech32AddressFromAddressTypes(storageOrExpirationUnlockCondition.returnAddress)
            if (address) {
                return getSubjectFromAddress(address, networkId)
            }
        }
    }
}
