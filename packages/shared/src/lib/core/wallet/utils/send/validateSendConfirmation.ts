import { ExpirationUnlockCondition, TimelockUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import {
    InsufficientFundsForStorageDepositError,
    InvalidExpirationDateTimeError,
    InvalidTimelockDateTimeError,
} from '@contexts/wallet'
import { getSelectedAccount } from '@core/account/stores'
import { convertUnixTimestampToDate, isFutureDateTime } from '@core/utils'
import { Output } from '@core/wallet/types'

export function validateSendConfirmation(output: Output): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.amount)
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available.toString() ?? '0')

    const expirationDateTime = getDateFromUnlockCondition(output, UnlockConditionType.Expiration)
    const timelockDateTime = getDateFromUnlockCondition(output, UnlockConditionType.Timelock)

    if (balance < amount) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isFutureDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    } else if (timelockDateTime && !isFutureDateTime(timelockDateTime)) {
        throw new InvalidTimelockDateTimeError()
    }
}

function getDateFromUnlockCondition(output: Output, type: number): Date | undefined {
    const unlockCondition = output.unlockConditions.find((c) => c.type === type) as
        | ExpirationUnlockCondition
        | TimelockUnlockCondition
    const unixTime = unlockCondition?.unixTime
    return unixTime ? convertUnixTimestampToDate(unixTime) : undefined
}
