import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { MarketCoinId, MarketCurrency } from '../enums'
import { coinGeckoTokensMetadata, updateMarketCoinPrices } from '../stores'
import { EvmChainId, NetworkId, NetworkNamespace } from '@core/network'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        const shimmerEvmNetworkId: NetworkId = `${NetworkNamespace.Evm}:${EvmChainId.ShimmerEvm}`
        const shimmerEvmTokens = get(coinGeckoTokensMetadata)?.[shimmerEvmNetworkId] ?? {}
        const shimmerEvmTokensAddresses = Object.keys(shimmerEvmTokens ?? {})
        const shimmerEvmTokensIds =
            shimmerEvmTokensAddresses.map((tokenAddress) => shimmerEvmTokens[tokenAddress].id) ?? []
        const marketPricesResponse = await CoinGeckoApi.getSimplePrices(
            [MarketCoinId.Shimmer, ...shimmerEvmTokensIds],
            Object.values(MarketCurrency)
        )
        updateMarketCoinPrices(marketPricesResponse)
    } catch (err) {
        console.error(err)
    }
}
