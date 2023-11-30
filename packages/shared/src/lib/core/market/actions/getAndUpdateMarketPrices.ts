import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { MarketCoinId, MarketCurrency } from '../enums'
import { coinGeckoTokensMetadata, updateMarketCoinPrices } from '../stores'
import { SupportedNetworkId } from '@core/network'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        // TODO: check which layer 2 networks to pull prices for based on profile network/chains
        const shimmerEvmTokens = Object.values(get(coinGeckoTokensMetadata)?.[SupportedNetworkId.ShimmerEvm] ?? {})
        const shimmerEvmTokensIds = shimmerEvmTokens.map((token) => token.id)
        const marketPricesResponse = await CoinGeckoApi.getSimplePrices(
            [MarketCoinId.Iota, MarketCoinId.Shimmer, ...shimmerEvmTokensIds],
            Object.values(MarketCurrency)
        )
        updateMarketCoinPrices(marketPricesResponse)
    } catch (err) {
        console.error(err)
    }
}
