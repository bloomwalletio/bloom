import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { coinGeckoTokensMetadata } from '../stores'
import { CoinGeckoNetworkId } from '../enums'
import { SupportedIscNetworkId } from '@core/network/constants'

export async function getAndUpdateShimmerEvmTokensMetadata(): Promise<void> {
    try {
        const coinGeckoShimmerEvmTokens = await CoinGeckoApi.getFilteredCoinsList(CoinGeckoNetworkId.ShimmerEVM)
        const networkId = SupportedIscNetworkId.ShimmerEvm
        const tokenMetadataPromises = coinGeckoShimmerEvmTokens.map(async (token) => {
            const tokenAddress = token.platforms[CoinGeckoNetworkId.ShimmerEVM]
            if (get(coinGeckoTokensMetadata)?.[networkId]?.[tokenAddress]) {
                return
            }
            const tokenDetails = await CoinGeckoApi.getCoinDetails(token.id)
            return { [tokenAddress]: tokenDetails ?? {} }
        })
        const tokensMetadataList = await Promise.all(tokenMetadataPromises)
        const tokensMetadata = Object.assign({}, ...tokensMetadataList)
        coinGeckoTokensMetadata.update((metadata) => {
            return {
                ...metadata,
                [networkId]: { ...metadata[networkId], ...tokensMetadata },
            }
        })
    } catch (err) {
        console.error(err)
    }
}
