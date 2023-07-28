import {
    UnlockConditionType,
    CommonOutput,
    StorageDepositReturnUnlockCondition,
} from '@iota/sdk/out/types/block/output'

export function getStorageDepositFromOutput(output: CommonOutput): number {
    const storageDepositReturnUnlockCondition = <StorageDepositReturnUnlockCondition>(
        output
            ?.getUnlockConditions()
            ?.find((unlockCondition) => unlockCondition?.getType() === UnlockConditionType.StorageDepositReturn)
    )

    return storageDepositReturnUnlockCondition ? Number(storageDepositReturnUnlockCondition.getAmount()) : 0
}
