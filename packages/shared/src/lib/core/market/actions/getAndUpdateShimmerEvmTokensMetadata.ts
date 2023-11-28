import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { coinGeckoTokensMetadata } from '../stores'
import { CoinGeckoNetworkId } from '../enums'

export async function getAndUpdateShimmerEvmTokensMetadata(): Promise<void> {
    try {
        const coinGeckoShimmerEvmTokens = await CoinGeckoApi.getFilteredCoinsList(CoinGeckoNetworkId.ShimmerEVM)
        const tokenMetadataPromises = coinGeckoShimmerEvmTokens.map(async (token) => {
            if (get(coinGeckoTokensMetadata)[token.id]) {
                return
            }
            const tokenDetails = await CoinGeckoApi.getCoinDetails(token.id)
            return { [token.symbol]: tokenDetails ?? {} }
        })
        const tokensMetadata = await Promise.all(tokenMetadataPromises)
        coinGeckoTokensMetadata.update((metadata) => {
            return {
                ...metadata,
                ...Object.assign({}, ...tokensMetadata),
            }
        })
    } catch (err) {
        console.error(err)
    }
}
