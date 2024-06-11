import { appSettings } from '@core/app/stores'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function formatCurrency(
    rawAmount: string | undefined,
    currency: string | undefined = undefined,
    grouped: boolean = false
): string {
    if (rawAmount === undefined || !isFinite(Number(rawAmount))) {
        return ''
    }
    const value = Number(rawAmount)
    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.marketCurrency
    }

    let convertedValue: number | bigint
    if (value < 1) {
        convertedValue = Number(value.toPrecision(2))
    } else if (value > 1e15) {
        try {
            convertedValue = BigInt(rawAmount)
        } catch {
            convertedValue = BigInt(value)
        }
    } else {
        convertedValue = Number(value.toFixed(2))
    }

    const formatter = Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: currency ?? 'USD',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 20,
        useGrouping: grouped,
    })

    return formatter.format(convertedValue)
}
