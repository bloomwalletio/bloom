import { CommonOutput, Output, OutputType, UnlockConditionType } from '@iota/sdk/out/types'

const ASYNC_UNLOCK_CONDITION_TYPES = [
    UnlockConditionType.StorageDepositReturn,
    UnlockConditionType.Expiration,
    UnlockConditionType.Timelock,
]

export function isOutputAsync(output: Output): boolean {
    if (output.type === OutputType.Foundry) {
        return false
    }

    const { unlockConditions } = output as CommonOutput
    for (const unlockCondition of unlockConditions) {
        if (ASYNC_UNLOCK_CONDITION_TYPES.some((type) => type === unlockCondition.type)) {
            return true
        }
    }
    return false
}
