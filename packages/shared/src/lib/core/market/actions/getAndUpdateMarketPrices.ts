import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { MarketCoinId, MarketCurrency } from '../enums'
import { CoinGeckoCoin } from '../interfaces'
import { coinGeckoTokensMetadata, updateMarketCoinPrices } from '../stores'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        const storedTokenIds = Object.values(get(coinGeckoTokensMetadata)).flatMap((networkTokens) =>
            Object.values(networkTokens ?? {}).map((token: CoinGeckoCoin) => token.id)
        )

        const marketPricesResponse = await CoinGeckoApi.getSimplePrices(
            [MarketCoinId.Iota, MarketCoinId.Shimmer, ...storedTokenIds],
            Object.values(MarketCurrency)
        )
        updateMarketCoinPrices(marketPricesResponse)
    } catch (err) {
        console.error(err)
    }
}
