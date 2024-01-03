import { formatNumber } from '@core/i18n'
import { TokenMetadata } from '@core/token/types'
import { formatTokenAmountDefault, getUnitFromTokenMetadata } from '@core/token/utils'


export function formatTokenAmountBestMatch(
    amount: number,
    tokenMetadata: TokenMetadata,
    withUnit = true,
    round = true
): string {
    const _amount = round ? Number(formatTokenAmountDefault(amount, tokenMetadata, '', false)) : amount

    const formattedAmount = round ? roundAndFormatAmount(_amount) : formatNumber(_amount, 0, undefined, undefined, true)
    const unit = getUnitFromTokenMetadata(tokenMetadata)

    return withUnit && unit ? formattedAmount + ' ' + unit  : formattedAmount
}

export function roundAndFormatAmount(
    amount: number,
    tokenMetadata?: TokenMetadata,
): string {
    if (isNaN(amount)) {
        return formatNumber(0, 0, 0, 0, true)
    }

    const stringAmount = amount.toString()
    const splittedAmount = stringAmount.split('.')
    const integer = splittedAmount[0]
    const decimals = splittedAmount[1]

    if (decimals === undefined) {
        return formatNumber(amount, 0, 0, 0, true)
    }

    if (amount >= 1) {
        const maxDigitsWithDecimals = 12
        const integerLength = integer.length
        const maxDecimals = Math.max(maxDigitsWithDecimals - integerLength, 0)

        return formatNumber(amount, 0, maxDecimals, undefined, true)
    }

    return getSignificantDigits(decimals)
}

function getSignificantDigits(decimals: string, limit: number = 3): string {
    if (decimals.length < 0 || decimals.length <= limit) {
        return decimals
    }

    if (decimals.length > 10) {
        return '≈0'
    }

    const firstIndex = decimals.split('').findIndex((digit) => Number(digit) > 0)

    if (decimals.length <= firstIndex + limit) {
        const lastIndex = decimals.length - 1
        const result = decimals.slice(0, lastIndex)
        return result
    }

    const lastIndex = firstIndex + limit - 1

    const roundedResult = Number('0.' + decimals.slice(0, lastIndex + 1)).toFixed(lastIndex + 1)

    return String(roundedResult)
}
