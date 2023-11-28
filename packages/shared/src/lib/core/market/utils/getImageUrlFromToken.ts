import { CoinGeckoCoinImage } from '../interfaces'
import { coinGeckoTokensMetadata } from '../stores'
import { get } from 'svelte/store'
import { IToken, TokenStandard } from '@core/token'

export function getImageUrlFromToken(token: IToken, size: keyof CoinGeckoCoinImage = 'large'): string {
    if (token.standard === TokenStandard.Erc20 || token.standard === TokenStandard.Irc30) {
        const coinGeckoToken = get(coinGeckoTokensMetadata)?.[token.networkId]?.[token.id]
        const imageObj = coinGeckoToken?.image
        return imageObj?.[size] ?? imageObj?.[Object.keys(imageObj ?? {}).at(-1) as keyof CoinGeckoCoinImage] ?? ''
    } else {
        return ''
    }
}
