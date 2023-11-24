import { CoinGeckoApi } from '../apis'
import { CoinGeckoCoinImage } from '../interfaces'
import { shimmerEvmTokensImages } from '../stores'

export async function getAndUpdateShimmerEvmTokensImages(): Promise<void> {
    try {
        const coinGeckoShimmerEvmTokens = await CoinGeckoApi.getFilteredCoinsList()
        const tokenImagePromises = coinGeckoShimmerEvmTokens.map(async (token) => {
            const tokenDetails = await CoinGeckoApi.getCoinDetails(token.id)
            return { [token.platforms.shimmer_evm]: tokenDetails.image ?? {} }
        })
        const tokenImages = await Promise.all(tokenImagePromises)
        const tokenImageList = tokenImages.reduce(
            (list, current) => {
                return { ...list, ...current }
            },
            {} as Record<string, CoinGeckoCoinImage>
        )
        shimmerEvmTokensImages.set(tokenImageList)
    } catch (err) {
        console.error(err)
    }
}
