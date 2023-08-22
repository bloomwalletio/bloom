import { OutputType, UnlockConditionType } from '@iota/sdk/out/types'
import { Output } from '@core/wallet/types'

const ASYNC_UNLOCK_CONDITION_TYPES = [
    UnlockConditionType.StorageDepositReturn,
    UnlockConditionType.Expiration,
    UnlockConditionType.Timelock,
]

export function isOutputAsync(output: Output): boolean {
    if (output.type === OutputType.Foundry) {
        return false
    }

    for (const unlockCondition of output.unlockConditions) {
        if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
            return true
        }
    }
    return false
}
