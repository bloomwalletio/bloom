import { ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { InsufficientFundsForStorageDepositError, InvalidExpirationDateTimeError } from '@contexts/wallet'
import { getSelectedAccount } from '@core/account/stores'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { Output } from '@core/wallet/types'

export function validateSendConfirmation(output: Output): void {
    const parseNumber: (value: string) => number = (value: string) => parseInt(value, 10) ?? 0
    const amount = parseNumber(output?.amount)
    const balance = parseNumber(getSelectedAccount()?.balances?.baseCoin.available ?? '0')

    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const expirationUnixTime = expirationUnlockCondition?.unixTime
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    if (balance < amount) {
        throw new InsufficientFundsForStorageDepositError()
    } else if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
