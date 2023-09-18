import { get } from 'svelte/store'
import { appSettings } from '@core/app/stores'

export function getCurrencySymbol(currency: string): string {
    const appLanguage = get(appSettings).language

    return (0)
        .toLocaleString(appLanguage, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
        .replace(/\d/g, '')
        .trim()
}
