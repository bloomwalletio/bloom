import { formatDate } from '@core/i18n'

import { HEX_PREFIX, HEXADECIMAL_REGEXP } from './constants'

export function formatHexString(
    hex: string | undefined,
    shouldBeUppercase: boolean = true,
    shouldIncludePrefix: boolean = true
): string {
    if (!hex || !HEXADECIMAL_REGEXP.test(hex)) {
        return '00'
    }

    hex = hex.replace(HEX_PREFIX, '')

    let result = ''
    if (shouldIncludePrefix) {
        result += HEX_PREFIX
    }

    result += shouldBeUppercase ? hex.toUpperCase() : hex.toLowerCase()

    return result
}

export function getMonthYear(date: Date): string {
    return formatDate(date, { year: 'numeric', month: 'short' })
}
