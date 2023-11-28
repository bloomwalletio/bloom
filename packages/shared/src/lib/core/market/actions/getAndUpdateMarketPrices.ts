import { CoinGeckoApi } from '../apis'
import { MarketCoinId, MarketCurrency } from '../enums'
import { updateMarketCoinPrices } from '../stores'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        const marketPricesResponse = await CoinGeckoApi.getSimplePrices(
            [MarketCoinId.Shimmer],
            Object.values(MarketCurrency)
        )
        updateMarketCoinPrices(marketPricesResponse)
    } catch (err) {
        console.error(err)
    }
}
