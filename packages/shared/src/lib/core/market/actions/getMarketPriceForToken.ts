import { activeProfile } from '@core/profile/stores'
import { ITokenWithBalance } from '@core/token/interfaces'
import { get } from 'svelte/store'

export function getMarketPriceForToken(
    token: ITokenWithBalance,
    marketCurrency = get(activeProfile)?.settings?.marketCurrency
): string | undefined {
    const marketPrice = token?.marketPrices?.[marketCurrency]
    return marketPrice ? String(marketPrice) : undefined
}
