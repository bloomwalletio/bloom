import { appSettings } from '@core/app/stores'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function getGroupSeparator(currency: string | undefined = undefined): string {
    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.marketCurrency
    }

    return (
        Intl.NumberFormat(appLanguage, {
            style: 'currency',
            currency: currency.length > 3 ? 'USD' : currency,
        })
            .formatToParts(1111111)
            .find((part) => part.type === 'group')?.value ?? ','
    )
}
