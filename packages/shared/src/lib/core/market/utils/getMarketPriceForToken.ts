import { activeProfile } from '@core/profile'
import { IToken } from '@core/token/interfaces'
import { get } from 'svelte/store'

export function getMarketPriceForToken(token: IToken): number | undefined {
    const marketCurrency = get(activeProfile)?.settings?.marketCurrency
    return token?.marketPrices?.[marketCurrency]
}
