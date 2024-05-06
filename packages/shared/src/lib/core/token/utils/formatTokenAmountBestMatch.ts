import { getUnitFromTokenMetadata } from './getUnitFromTokenMetadata'
import { TokenMetadata } from '../types'
import { getDecimalSeparator, getGroupSeparator } from '@core/i18n'
import { MAX_SUPPORTED_DECIMALS } from '@core/wallet'

const DEFAULT_MAX_DECIMALS = 6

type FormatOptions = Partial<{
    withUnit: boolean
    round: boolean
    decimals: number
}>

export function formatTokenAmountBestMatch(
    amount: bigint | undefined,
    tokenMetadata?: TokenMetadata,
    options?: FormatOptions
): string {
    const defaultOptions = {
        withUnit: true,
        round: true,
        decimals: tokenMetadata?.decimals,
    }
    const mergedOptions = { ...defaultOptions, ...options }

    const unit = mergedOptions.withUnit ? getUnitFromTokenMetadata(tokenMetadata) : undefined

    if (typeof amount !== 'bigint') {
        return '-'
    }

    const stringAmount = getStringAmountFromBigInt(
        amount,
        mergedOptions.round,
        tokenMetadata?.decimals,
        mergedOptions.decimals
    )
    return getAmountWithUnit(stringAmount, unit)
}

function getStringAmountFromBigInt(
    value: bigint,
    round: boolean,
    decimals: number | undefined,
    maxDecimalLength: number | undefined
): string {
    let stringValue = String(value)

    if (!decimals) {
        return getGroupedStringAmount(stringValue)
    }

    if (decimals > MAX_SUPPORTED_DECIMALS) {
        return '-'
    }

    while (stringValue.length <= decimals) {
        stringValue = '0' + stringValue
    }

    const indexOfDecimalSeparator = stringValue.length - decimals

    const stringAmountParts: string[] = []

    let integerPart = stringValue.slice(0, indexOfDecimalSeparator)
    const allIntegersZero = integerPart.split('').every((integer) => integer === '0')
    integerPart = allIntegersZero ? '0' : getGroupedStringAmount(integerPart)
    stringAmountParts.push(integerPart)

    const _maxDecimalLength =
        maxDecimalLength !== undefined
            ? Math.min(maxDecimalLength, DEFAULT_MAX_DECIMALS - (integerPart.length - 1))
            : Math.max(DEFAULT_MAX_DECIMALS - (integerPart.length - 1), 0)

    let decimalPart = stringValue.slice(
        indexOfDecimalSeparator,
        round ? indexOfDecimalSeparator + _maxDecimalLength : undefined
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
