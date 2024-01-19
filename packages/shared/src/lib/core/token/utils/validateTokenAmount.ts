import { localize, parseCurrency } from '@core/i18n'
import { convertToRawAmount } from '@core/token'
import { ITokenWithBalance } from '@core/token/interfaces'

export function validateTokenAmount(
    amount: string,
    token: ITokenWithBalance,
    unit: string,
    allowZeroOrNull = false
): Promise<bigint> {
    if (amount === undefined || token?.metadata === undefined) {
        return Promise.reject()
    }
    const amountAsFloat = parseCurrency(String(amount).replace('n', ''))
    const isAmountZeroOrNull = !Number(amountAsFloat)
    const bigAmount = convertToRawAmount(amount, token.metadata, unit) ?? BigInt(0)
    // Zero value transactions can still contain metadata/tags
    let error = ''
    if (allowZeroOrNull && isAmountZeroOrNull) {
        return Promise.resolve(BigInt(0))
    } else if (isAmountZeroOrNull) {
        error = localize('error.send.amountInvalidFormat')
    } else if (bigAmount > BigInt(token?.balance?.available ?? 0)) {
        error = localize('error.send.amountTooHigh')
    } else if (bigAmount <= BigInt(0)) {
        error = localize('error.send.amountZero')
    } else if (bigAmount % BigInt(1) !== BigInt(0)) {
        error = localize('error.send.amountSmallerThanSubunit')
    }

    if (error) {
        return Promise.reject(error)
    }
    return Promise.resolve(bigAmount)
}
