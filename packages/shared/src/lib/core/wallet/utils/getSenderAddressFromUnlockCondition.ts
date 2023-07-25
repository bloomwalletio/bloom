import {
    ExpirationUnlockCondition,
    StorageDepositReturnUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { ADDRESS_TYPE_ED25519 } from '../constants'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'

export function getSenderAddressFromUnlockCondition(
    unlockCondition: StorageDepositReturnUnlockCondition | ExpirationUnlockCondition
): string | undefined {
    if (
        (unlockCondition?.type === UnlockConditionType.StorageDepositReturn ||
            unlockCondition?.type === UnlockConditionType.Expiration) &&
        unlockCondition?.returnAddress?.type === ADDRESS_TYPE_ED25519
    ) {
        return getBech32AddressFromAddressTypes(unlockCondition?.returnAddress)
    } else {
        return undefined
    }
}
