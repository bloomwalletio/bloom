import { TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { Output } from '@core/wallet/types'

export function getTimelockDateFromOutput(output: Output): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            const timelockUnlockCondition = unlockCondition as TimelockUnlockCondition
            return timelockUnlockCondition?.unixTime
                ? new Date(timelockUnlockCondition?.unixTime * MILLISECONDS_PER_SECOND)
                : undefined
        }
    }
}
