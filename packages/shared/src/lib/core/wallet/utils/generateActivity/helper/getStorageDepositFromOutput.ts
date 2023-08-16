import { UnlockConditionType, CommonOutput, StorageDepositReturnUnlockCondition } from '@iota/sdk/out/types'

export function getStorageDepositFromOutput(output: CommonOutput): number {
    const storageDepositReturnUnlockCondition = <StorageDepositReturnUnlockCondition>(
        output
            ?.getUnlockConditions()
            ?.find((unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn)
    )

    return storageDepositReturnUnlockCondition ? Number(storageDepositReturnUnlockCondition.getAmount()) : 0
}
