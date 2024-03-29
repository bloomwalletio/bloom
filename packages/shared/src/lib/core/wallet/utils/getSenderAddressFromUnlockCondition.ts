import {
    AddressType,
    ExpirationUnlockCondition,
    StorageDepositReturnUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'

export function getSenderAddressFromUnlockCondition(
    unlockCondition: StorageDepositReturnUnlockCondition | ExpirationUnlockCondition
): string | undefined {
    if (
        (unlockCondition?.type === UnlockConditionType.StorageDepositReturn ||
            unlockCondition?.type === UnlockConditionType.Expiration) &&
        unlockCondition?.returnAddress?.type === AddressType.Ed25519
    ) {
        return getBech32AddressFromAddressTypes(unlockCondition?.returnAddress)
    } else {
        return undefined
    }
}
