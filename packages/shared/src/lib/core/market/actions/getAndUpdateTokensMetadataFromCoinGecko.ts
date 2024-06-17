import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { coinGeckoTokensMetadata } from '../stores'
import { CoinGeckoNetworkId } from '../enums'
import { SupportedIscNetworkId } from '@core/network/constants'
import { CoinGeckoCoin } from '../interfaces'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

const NETWORK_FROM_PLATFORM: { [key in CoinGeckoNetworkId]: string } = {
    [CoinGeckoNetworkId.IotaEvm]: SupportedIscNetworkId.IotaEvm,
    [CoinGeckoNetworkId.ShimmerEvm]: SupportedIscNetworkId.ShimmerEvm,
}

export async function getAndUpdateTokensMetadataFromCoinGecko(): Promise<void> {
    try {
        const coinGeckoShimmerEvmTokens = await CoinGeckoApi.getFilteredCoinsList(
            CoinGeckoNetworkId.IotaEvm,
            CoinGeckoNetworkId.ShimmerEvm
        )

        // delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 15 * MILLISECONDS_PER_SECOND))

        const tokenMetadata: Record<string, Record<string, CoinGeckoCoin> | undefined> =
            get(coinGeckoTokensMetadata) ?? {}
        for (const token of coinGeckoShimmerEvmTokens) {
            const needsToFetchForIota =
                token.platforms[CoinGeckoNetworkId.IotaEvm] &&
                !get(coinGeckoTokensMetadata)?.[SupportedIscNetworkId.IotaEvm]?.[
                    token.platforms[CoinGeckoNetworkId.IotaEvm]
                ]
            const needsToFetchForShimmer =
                token.platforms[CoinGeckoNetworkId.ShimmerEvm] &&
                !get(coinGeckoTokensMetadata)?.[SupportedIscNetworkId.ShimmerEvm]?.[
                    token.platforms[CoinGeckoNetworkId.ShimmerEvm]
                ]
            const shouldFetchDetails = needsToFetchForIota || needsToFetchForShimmer

            if (shouldFetchDetails) {
                try {
                    // delay to avoid rate limiting
                    await new Promise((resolve) => setTimeout(resolve, 15 * MILLISECONDS_PER_SECOND))
                    const tokenDetails = await CoinGeckoApi.getCoinDetails(token.id)
                    for (const [platform, address] of Object.entries(token.platforms)) {
                        if (platform === CoinGeckoNetworkId.IotaEvm || platform === CoinGeckoNetworkId.ShimmerEvm) {
                            const network = NETWORK_FROM_PLATFORM[platform]
                            if (!tokenMetadata[network]) {
                                tokenMetadata[network] = {}
                            }
                            // ts-expect-error
                            tokenMetadata[network][address] = tokenDetails ?? {}
                        }
                    }
                } catch {
                    console.error(`Could not fetch token details for ${token.id}`)
                }
            }
        }
        coinGeckoTokensMetadata.update((metadata) => {
            return {
                ...metadata,
                ...tokenMetadata,
            }
        })
    } catch (err) {
        console.error(err)
    }
}
