import { derived, Readable } from 'svelte/store'
import { CoinGeckoCoinImage } from '../interfaces'
import { coinGeckoTokensMetadata } from './coingecko-tokens-metadata'
import { CoinGeckoNetworkId } from '../enums'

export const tokensImages: Readable<Record<string, CoinGeckoCoinImage>> = derived(
    [coinGeckoTokensMetadata],
    ([$coinGeckoTokensMetadata]) => {
        return Object.values($coinGeckoTokensMetadata).reduce(
            (images, token) => {
                if (token?.image) {
                    return { ...images, [token.platforms[CoinGeckoNetworkId.ShimmerEVM]]: token.image }
                }
                return images
            },
            {} as Record<string, CoinGeckoCoinImage>
        )
    }
)
