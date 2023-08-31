import {
    InsufficientFundsForStorageDepositError,
    InvalidExpirationDateTimeError,
    InvalidTimelockDateTimeError,
} from '@contexts/wallet'
import { getSelectedAccount } from '@core/account/stores'
import { convertUnixTimestampToDate, isFutureDateTime } from '@core/utils'
import { UNLOCK_CONDITION_EXPIRATION, UNLOCK_CONDITION_TIMELOCK } from '@core/wallet/constants'
import { Output } from '@core/wallet/types'
import { IExpirationUnlockCondition, ITimelockUnlockCondition } from '@iota/types'

export function validateSendConfirmation(output: Output): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.amount)
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available ?? '0')

    const expirationDateTime = getDateFromUnlockCondition(output, UNLOCK_CONDITION_EXPIRATION)
    const timelockDateTime = getDateFromUnlockCondition(output, UNLOCK_CONDITION_TIMELOCK)

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
        | IExpirationUnlockCondition
        | ITimelockUnlockCondition
    const unixTime = unlockCondition?.unixTime
    return unixTime ? convertUnixTimestampToDate(unixTime) : undefined
}
