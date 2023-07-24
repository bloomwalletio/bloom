import { Output } from '@core/wallet/types'
import { IStorageDepositReturnUnlockCondition } from '@iota/types'
import { UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../../../constants'

export function getStorageDepositFromOutput(output: Output): number {
    const storageDepositReturnUnlockCondition = <IStorageDepositReturnUnlockCondition>(
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
    )

    return storageDepositReturnUnlockCondition ? Number(storageDepositReturnUnlockCondition.amount) : 0
}
