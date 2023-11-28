import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { CoinGeckoCoinImage } from '../interfaces'
import { tokensImages } from '../stores'
import { CoinGeckoNetworkId } from '../enums'

export async function getAndUpdateShimmerEvmTokensImages(): Promise<void> {
    try {
        const coinGeckoShimmerEvmTokens = await CoinGeckoApi.getFilteredCoinsList(CoinGeckoNetworkId.ShimmerEVM)
        const tokenImagePromises = coinGeckoShimmerEvmTokens.map(async (token) => {
            if (get(tokensImages)[token.id]) {
                return
            }
            const tokenDetails = await CoinGeckoApi.getCoinDetails(token.id)
            return { [token.platforms[CoinGeckoNetworkId.ShimmerEVM]]: tokenDetails.image ?? {} }
        })
        const tokenImages = await Promise.all(tokenImagePromises)
        const tokenImageList = tokenImages.reduce(
            (list, current) => {
                return { ...list, ...current }
            },
            {} as Record<string, CoinGeckoCoinImage>
        )
        tokensImages.update((images) => ({ ...images, ...tokenImageList }))
    } catch (err) {
        console.error(err)
    }
}
