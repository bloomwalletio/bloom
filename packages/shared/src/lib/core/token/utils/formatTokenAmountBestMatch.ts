import { getUnitFromTokenMetadata } from './getUnitFromTokenMetadata'
import { TokenMetadata } from '../types'
import { getDecimalSeparator, getGroupSeparator } from '@core/i18n'

const DEFAULT_MAX_DECIMALS = 6

export function formatTokenAmountBestMatch(
    amount: bigint,
    tokenMetadata: TokenMetadata,
    withUnit = true,
    round = true
): string {
    const unit = withUnit ? getUnitFromTokenMetadata(tokenMetadata) : undefined

    if (typeof amount !== 'bigint') {
        return '-'
    }

    const stringAmount = getStringAmountFromBigInt(amount, round, tokenMetadata?.decimals)
    return getAmountWithUnit(stringAmount, unit)
}

function getStringAmountFromBigInt(value: bigint, round: boolean, decimals?: number): string {
    let stringValue = String(value)

    if (!decimals) {
        return getGroupedStringAmount(stringValue)
    }

    while (stringValue.length <= decimals) {
        stringValue = '0' + stringValue
    }

    const indexOfDecimalSeparator = stringValue.length - decimals

    const stringAmountParts = []

    let integerPart = stringValue.slice(0, indexOfDecimalSeparator)
    const allIntegersZero = integerPart.split('').every((integer) => integer === '0')
    integerPart = allIntegersZero ? '0' : getGroupedStringAmount(integerPart)
    stringAmountParts.push(integerPart)

    const maxDecimalLength = Math.max(DEFAULT_MAX_DECIMALS - (integerPart.length - 1), 0)

    let decimalPart = stringValue.slice(
        indexOfDecimalSeparator,
        round ? indexOfDecimalSeparator + maxDecimalLength : undefined
    )
    const allDecimalsZero = decimalPart.split('').every((decimal) => decimal === '0')
    decimalPart = removeTrailingZero(decimalPart)
    !allDecimalsZero && stringAmountParts.push(decimalPart)

    const stringAmount = stringAmountParts.join(getDecimalSeparator())
    return stringAmount === '0' && value > 0 ? '≈0' : stringAmount
}

function removeTrailingZero(amount: string): string {
    const array = amount.split('')
    for (let i = 0; array.length; i++) {
        if (array.at(-1) === '0') {
            array.pop()
        } else {
            return array.join('')
        }
    }
    return ''
}

function getGroupedStringAmount(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, getGroupSeparator())
}

function getAmountWithUnit(amount: string, unit?: string): string {
    return unit ? amount + ' ' + unit : amount
}
