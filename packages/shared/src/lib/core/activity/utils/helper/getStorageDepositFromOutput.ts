import { UnlockConditionType, CommonOutput, StorageDepositReturnUnlockCondition } from '@iota/sdk/out/types'

export function getStorageDepositFromOutput(output: CommonOutput): number {
    const storageDepositReturnUnlockCondition = <StorageDepositReturnUnlockCondition>(
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
        )
    )

    return storageDepositReturnUnlockCondition ? Number(storageDepositReturnUnlockCondition.amount) : 0
}
