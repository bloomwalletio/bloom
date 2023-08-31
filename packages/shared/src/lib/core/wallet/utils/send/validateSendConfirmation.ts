import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { getSelectedAccount } from '@core/account/stores'
import { convertUnixTimestampToDate, isFutureDateTime } from '@core/utils'
import { UNLOCK_CONDITION_EXPIRATION } from '@core/wallet/constants'
import { Output } from '@core/wallet/types'
import { IExpirationUnlockCondition } from '@iota/types'

export function validateSendConfirmation(output: Output): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.amount)
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available ?? '0')

    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UNLOCK_CONDITION_EXPIRATION
    ) as IExpirationUnlockCondition
    const expirationUnixTime = expirationUnlockCondition?.unixTime
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    if (balance < amount) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isFutureDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
