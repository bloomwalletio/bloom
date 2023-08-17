import { UnlockConditionType } from '@iota/sdk/out/types'
import { Output, Subject } from '@core/wallet/types'
import { getBech32AddressFromAddressTypes, getSubjectFromAddress } from '@core/wallet/utils'

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
