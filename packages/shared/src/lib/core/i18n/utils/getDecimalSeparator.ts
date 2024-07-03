import { appSettings } from '@core/app/stores'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function getDecimalSeparator(currency: string | undefined = undefined): string {
    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.marketCurrency
    }

    const isCurrencySupportedByIntl = currency?.length <= 3
    return (
        Intl.NumberFormat(appLanguage, {
            style: 'currency',
            currency: isCurrencySupportedByIntl ? currency : 'USD',
        })
            .formatToParts(1.1)
            .find((part) => part.type === 'decimal')?.value ?? '.'
    )
}
