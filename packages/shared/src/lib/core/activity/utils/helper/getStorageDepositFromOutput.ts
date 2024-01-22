import { UnlockConditionType, CommonOutput, StorageDepositReturnUnlockCondition } from '@iota/sdk/out/types'

export function getStorageDepositFromOutput(output: CommonOutput): bigint {
    const storageDepositReturnUnlockCondition = <StorageDepositReturnUnlockCondition>(
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
        )
    )

    return BigInt(storageDepositReturnUnlockCondition ? storageDepositReturnUnlockCondition.amount : 0)
}
