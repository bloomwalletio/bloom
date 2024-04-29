import { derived, Readable } from 'svelte/store'
import { coinGeckoTokensMetadata } from './coingecko-tokens-metadata.store'
import { SupportedIscNetworkId } from '@core/network/constants'

export const shimmerEvmAddressToCoinGeckoIdMap: Readable<Record<string, string>> = derived(
    coinGeckoTokensMetadata,
    ($coinGeckoTokensMetadata) => {
        const shimmerEvmNetworkId = SupportedIscNetworkId.ShimmerEvm
        const shimmerEvmTokens = $coinGeckoTokensMetadata?.[shimmerEvmNetworkId] ?? {}
        const shimmerEvmTokensAddresses = Object.entries(shimmerEvmTokens ?? {}).reduce(
            (acc, [tokenAddress, token]) => {
                acc[tokenAddress] = token.id
                return acc
            },
            {} as Record<string, string>
        )
        return shimmerEvmTokensAddresses
    }
)
