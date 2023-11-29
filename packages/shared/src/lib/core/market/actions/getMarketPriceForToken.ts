import { activeProfile } from '@core/profile/stores'
import { ITokenWithBalance } from '@core/token/interfaces'
import { get } from 'svelte/store'

export function getMarketPriceForToken(token: ITokenWithBalance): number | undefined {
    const marketCurrency = get(activeProfile)?.settings?.marketCurrency
    return token?.marketPrices?.[marketCurrency]
}
