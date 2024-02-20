import { CoinGeckoCoinImage } from '../interfaces'
import { coinGeckoTokensMetadata } from '../stores'
import { get } from 'svelte/store'
import { IToken, TokenStandard } from '@core/token'

export function getImageUrlFromToken(token: IToken, size: keyof CoinGeckoCoinImage = 'large'): string | undefined {
    if (token.standard === TokenStandard.Irc30 && token.metadata?.standard === TokenStandard.Irc30) {
        return token.metadata?.logoUrl
    } else if (token.standard === TokenStandard.Erc20) {
        const coinGeckoToken = get(coinGeckoTokensMetadata)?.[token.networkId]?.[token?.id]
        const imageObj = coinGeckoToken?.image
        return imageObj?.[size] ?? imageObj?.[Object.keys(imageObj ?? {}).at(-1) as keyof CoinGeckoCoinImage]
    }
}
