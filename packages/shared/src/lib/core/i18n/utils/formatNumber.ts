import { get } from 'svelte/store'

import { appSettings } from '@core/app/stores'

import { ensureZeroes } from './ensureZeroes'

const ETHEREUM_MAX_DECIMALS = 18

export function formatNumber(
    value: number,
    minDecimals: number | undefined = undefined,
    maxDecimals: number | undefined = undefined,
    maxSignificantDigits: number | undefined = undefined,
    maxZeros: number = 2,
    grouped: boolean = false
): string {
    // The decimals are truncated anyway if the value is larger than what JS can represent safely.
    if (value > Number.MAX_SAFE_INTEGER) {
        return String(value)
    }

    // The maximum decimals are equal to the max decimals of Ethereum.
    // Larger values throw an error when trying to format.
    if (maxDecimals && maxDecimals > ETHEREUM_MAX_DECIMALS) {
        return String(value)
    }

    const appLanguage = get(appSettings)?.language ?? 'en'

    const formatted = Intl.NumberFormat(appLanguage, {
        minimumFractionDigits: minDecimals ?? 2,
        maximumFractionDigits: maxDecimals ?? ETHEREUM_MAX_DECIMALS,
        maximumSignificantDigits: maxSignificantDigits,
        useGrouping: grouped,
    }).format(value)

    return ensureZeroes(formatted, maxZeros)
}
