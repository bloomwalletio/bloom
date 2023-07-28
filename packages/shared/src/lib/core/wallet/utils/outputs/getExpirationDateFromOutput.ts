import { UnlockConditionType } from '@iota/sdk/out/types/block/output'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { Output } from '@core/wallet/types'

export function getExpirationDateFromOutput(output: Output): Date | undefined {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: Output): number | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition?.type === UnlockConditionType.Expiration) {
            return unlockCondition?.unixTime * MILLISECONDS_PER_SECOND
        }
    }
}
