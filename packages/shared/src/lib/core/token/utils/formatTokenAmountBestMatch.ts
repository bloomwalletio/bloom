import { formatNumber } from '@core/i18n'
import { TokenMetadata } from '@core/token/types'
import { getUnitFromTokenMetadata } from '@core/token/utils'

export function formatTokenAmountBestMatch(
    amount: number,
    tokenMetadata: TokenMetadata,
    round = true,
    withUnit = true
): string {
    const formattedAmount = round ? roundAndFormatAmount(amount) : formatNumber(amount, 0, undefined, undefined, true)
    const unit = getUnitFromTokenMetadata(tokenMetadata)

    return withUnit && unit ? formattedAmount + unit  : formattedAmount
}

export function formatTokenAmount(
    amount: number,
    tokenMetadata: TokenMetadata,
    round = true,
    withUnit = true
): string {
    const formattedAmount = round ? roundAndFormatAmount(amount) : formatNumber(amount, 0, undefined, undefined, true)
    const unit = getUnitFromTokenMetadata(tokenMetadata)

    return withUnit && unit ? formattedAmount + unit  : formattedAmount
}


export function roundAndFormatAmount(
    amount: number,
): string {
    if (isNaN(amount)) {
        return formatNumber(0, 0, 0, 0, true)
    }

    const stringAmount = amount.toString()
    const integer = stringAmount.split('.')[0]
    const decimals = stringAmount.split('.')[1]

    if (decimals === undefined) {
        return formatNumber(amount, 0, 0, 0, true)
    } else if ( amount >= 1) {
        // truncate decimals so max digits in in whole string is no greater than 12
        const maxDigitsWithDecimals = 12
        const integerLength = integer.length
        const maxDecimals = Math.max(maxDigitsWithDecimals - integerLength, 0)

        return formatNumber(amount, 0, maxDecimals, undefined, true)
    } else {
        if (decimals.length > 6) {
            return '≈0'
        } else {
            // round to three significant digits
            const indexFirstSignificantDigit = decimals.split('').findIndex((digit) => Number(digit) > 0)
            const indexLastSignificantDigit = indexFirstSignificantDigit + 2
            const roundedSignificantDigits = Number(decimals.slice(0, indexLastSignificantDigit + 1)).toFixed(indexLastSignificantDigit + 1)
            const significantDigits = String(roundedSignificantDigits)
            return getSignificantDigits(decimals)
        }
    }
}

function getSignificantDigits(decimals: string, limit: number = 3): string {
    const indexFirstSignificantDigit = decimals.split('').findIndex((digit) => Number(digit) > 0)
    const indexLastSignificantDigit = indexFirstSignificantDigit + 2
    const roundedSignificantDigits = Number(decimals.slice(0, indexLastSignificantDigit + 1)).toFixed(indexLastSignificantDigit + 1)
    const significantDigits = String(roundedSignificantDigits)
    return significantDigits
}
