import { IErc20Metadata } from '@core/token/interfaces'
import { CoinGeckoCoinImage } from '../interfaces'
import { coinGeckoTokensMetadata } from '../stores'
import { get } from 'svelte/store'
import { IToken, TokenStandard } from '@core/token'

export function getImageUrlFromToken(token: IToken, size: keyof CoinGeckoCoinImage = 'large'): string {
    if (token.standard === TokenStandard.Erc20) {
        const metadata = token.metadata as IErc20Metadata
        const imageObj = get(coinGeckoTokensMetadata)?.[metadata.symbol]?.image
        return imageObj?.[size] ?? imageObj?.[Object.keys(imageObj ?? {}).at(-1) as keyof CoinGeckoCoinImage] ?? ''
    } else {
        return ''
    }
}
