import { UnlockConditionType } from '@iota/sdk/out/types/block/output'
import { Output, Subject } from '../../types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'
import { getSubjectFromAddress } from '../getSubjectFromAddress'

export function getSenderFromOutput(output: Output): Subject | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (
            unlockCondition?.type === UnlockConditionType.StorageDepositReturn ||
            unlockCondition?.type === UnlockConditionType.Expiration
        ) {
            return getSubjectFromAddress(getBech32AddressFromAddressTypes(unlockCondition?.returnAddress))
        }
    }
}
