import { IconName } from '@bloomwalletio/ui'
import { SupportedNetworkId } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'

export const DEFAULT_TOKEN_ICON: { [networkId in SupportedNetworkId]?: { [tokenId: string]: IconName } } = {
    [SupportedNetworkId.Shimmer]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
    [SupportedNetworkId.Testnet]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
    [SupportedNetworkId.ShimmerEvm]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
    [SupportedNetworkId.ShimmerEvmTestnet]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
}
