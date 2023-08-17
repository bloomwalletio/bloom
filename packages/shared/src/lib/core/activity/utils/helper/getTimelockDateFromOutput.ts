import { UnlockConditionType } from '@iota/sdk/out/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { Output } from '@core/wallet/types'

export function getTimelockDateFromOutput(output: Output): Date | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Timelock) {
            return unlockCondition?.unixTime ? new Date(unlockCondition?.unixTime * MILLISECONDS_PER_SECOND) : undefined
        }
    }
}
