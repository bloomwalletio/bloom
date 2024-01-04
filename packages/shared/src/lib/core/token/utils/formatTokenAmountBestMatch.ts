import { formatNumber, getDecimalSeparator } from '@core/i18n'
import { isDecimal } from '@core/utils'
import { getUnitFromTokenMetadata } from './getUnitFromTokenMetadata'
import { TokenMetadata } from '../types'

const DEFAULT_SIGNIFICANT_DIGITS_LIMIT = 3
const MAX_DIGITS_WITH_DECIMALS = 12
const ZERO_AND_DECIMAL_SEPARATOR_LENGTH = 2

export function formatTokenAmountBestMatch(
    amount: number,
    tokenMetadata: TokenMetadata,
    withUnit = true,
    round = true
): string {
    const unit = withUnit ? getUnitFromTokenMetadata(tokenMetadata) : undefined

    if (isNaN(amount)) {
        const formattedAmount = '0'
        return getAmountWithUnit(formattedAmount, unit)
    }

    if (amount < 0) {
        throw new Error('Amount is negative')
    }

    if (amount > Number.MAX_SAFE_INTEGER) {
        // TODO: Refactor this when BigInt is used everywhere and we can precisely represent the amount.
        throw new Error('Amount is too large to be formatted')
    }

    if (isDecimal(amount)) {
        throw new Error('Amount is a decimal number')
    }

    if (!round) {
        const formattedAmount = formatNumber(amount, 0, undefined, undefined, true)
        return getAmountWithUnit(formattedAmount, unit)
    }

    const floatAmount = tokenMetadata?.decimals ? amount / 10 ** tokenMetadata?.decimals : amount
    const splittedAmount = String(floatAmount).split('.')

    const integer = splittedAmount[0]
    const decimals = splittedAmount[1]

    if (decimals === undefined) {
        const formattedAmount = formatNumber(amount, 0, 0, 0, true)
        return getAmountWithUnit(formattedAmount, unit)
    }

    if (amount >= 1) {
        const maxDecimals = Math.max(MAX_DIGITS_WITH_DECIMALS - integer.length, 0)
        const formattedAmount = formatNumber(amount, 0, maxDecimals, undefined, true)
        return getAmountWithUnit(formattedAmount, unit)
    }

    if (decimals.length > MAX_DIGITS_WITH_DECIMALS - ZERO_AND_DECIMAL_SEPARATOR_LENGTH) {
        return getAmountWithUnit('≈0', unit)
    }

    const formattedAmount = `0${getDecimalSeparator()}${getSignificantDigits(decimals)}}`
    return getAmountWithUnit(formattedAmount, unit)
}

export function getSignificantDigits(decimals: string, limit: number = DEFAULT_SIGNIFICANT_DIGITS_LIMIT): string {
    const indexFirstSignificantDigit = decimals.split('').findIndex((digit) => Number(digit) > 0)

    if (indexFirstSignificantDigit === -1) {
        return '0'.repeat(limit)
    }

    const significantDigits = decimals.slice(indexFirstSignificantDigit, indexFirstSignificantDigit + limit)
    return significantDigits
}

function getAmountWithUnit(amount: string, unit?: string): string {
    return unit ? amount + ' ' + unit : amount
}
