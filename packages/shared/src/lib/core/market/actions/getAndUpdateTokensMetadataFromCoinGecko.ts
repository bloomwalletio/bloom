import { SupportedIscNetworkId, SupportedL1EvmNetworkId } from '@core/network/constants/supported-network-id.constant'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { CoinGeckoApi } from '../apis'
import { CoinGeckoNetworkId } from '../enums/'
import { CoinGeckoCoin } from '../interfaces/'
import { coinGeckoTokensMetadata } from '../stores/'

const NETWORK_FROM_PLATFORM: { [key in CoinGeckoNetworkId]: string } = {
    [CoinGeckoNetworkId.IotaEvm]: SupportedIscNetworkId.IotaEvm,
    [CoinGeckoNetworkId.ShimmerEvm]: SupportedIscNetworkId.ShimmerEvm,
    [CoinGeckoNetworkId.Ethereum]: SupportedL1EvmNetworkId.Ethereum,
}

export async function getAndUpdateTokensMetadataFromCoinGecko(): Promise<void> {
    try {
        const coinGeckoShimmerEvmTokens = await CoinGeckoApi.getFilteredCoinsList(
            CoinGeckoNetworkId.IotaEvm,
            CoinGeckoNetworkId.ShimmerEvm
        )

        const tokenMetadata: Record<string, Record<string, CoinGeckoCoin> | undefined> =
            get(coinGeckoTokensMetadata) ?? {}
        for (const token of coinGeckoShimmerEvmTokens) {
            const needsToFetchForIota =
                token.platforms[CoinGeckoNetworkId.IotaEvm] &&
                !tokenMetadata?.[SupportedIscNetworkId.IotaEvm]?.[token.platforms[CoinGeckoNetworkId.IotaEvm]]
            const needsToFetchForShimmer =
                token.platforms[CoinGeckoNetworkId.ShimmerEvm] &&
                !tokenMetadata?.[SupportedIscNetworkId.ShimmerEvm]?.[token.platforms[CoinGeckoNetworkId.ShimmerEvm]]
            const shouldFetchDetails = needsToFetchForIota || needsToFetchForShimmer

            if (shouldFetchDetails) {
                try {
                    // delay to avoid rate limiting
                    await sleep(15 * MILLISECONDS_PER_SECOND)
                    const tokenDetails = await CoinGeckoApi.getCoinDetails(token.id)
                    for (const [platform, address] of Object.entries(token.platforms)) {
                        if (platform === CoinGeckoNetworkId.IotaEvm || platform === CoinGeckoNetworkId.ShimmerEvm) {
                            const network = NETWORK_FROM_PLATFORM[platform]
                            let tokenMetadataPerNetwork = tokenMetadata[network]
                            if (!tokenMetadataPerNetwork) {
                                tokenMetadataPerNetwork = {}
                            }
                            tokenMetadataPerNetwork[address] = tokenDetails ?? {}
                            tokenMetadata[network] = tokenMetadataPerNetwork
                        }
                    }

                    coinGeckoTokensMetadata.update((metadata) => {
                        return {
                            ...metadata,
                            ...tokenMetadata,
                        }
                    })
                } catch {
                    console.error(`Could not fetch token details for ${token.id}`)
                }
            }
        }
    } catch (err) {
        console.error(err)
    }
}
