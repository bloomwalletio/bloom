import { UnlockConditionType } from '@iota/sdk/out/types/block/output'

export const ASYNC_UNLOCK_CONDITION_TYPES = [
    UnlockConditionType.StorageDepositReturn,
    UnlockConditionType.Expiration,
    UnlockConditionType.Timelock,
]
