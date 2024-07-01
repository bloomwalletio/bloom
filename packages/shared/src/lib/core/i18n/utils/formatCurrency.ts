import { appSettings } from '@core/app/stores'
import { activeProfile } from '@core/profile/stores'
import { Converter } from '@core/utils'
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
        convertedValue = Converter.bigIntLikeToBigInt(rawAmount)
    } else {
        convertedValue = Number(value.toFixed(2))
    }

    const isCurrencyNotSupported = currency.length > 3
    if (isCurrencyNotSupported) {
        const formattedValue = convertedValue.toLocaleString(appLanguage, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 20,
            useGrouping: grouped,
        })
        return `${formattedValue} ${currency.toUpperCase()}`
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
