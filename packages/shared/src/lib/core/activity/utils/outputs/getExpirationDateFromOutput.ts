import { ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { Output } from '@core/wallet/types'

export function getExpirationDateFromOutput(output: Output): Date | undefined {
    const expirationTime = getExpirationUnixTimeFromOutput(output)
    return expirationTime ? new Date(expirationTime) : undefined
}

export function getExpirationUnixTimeFromOutput(output: Output): number | undefined {
    const expirationTime = output.unlockConditions.find(
        (unlockCondition) => unlockCondition?.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    return expirationTime ? expirationTime.unixTime * MILLISECONDS_PER_SECOND : undefined
}
