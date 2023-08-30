import { IconName } from '@bloomwalletio/ui'
import { SupportedNetworkId } from '@core/network'

export const DEFAULT_TOKEN_ICON: { [networkId in SupportedNetworkId]?: { [tokenId: string]: IconName } } = {
    [SupportedNetworkId.Shimmer]: {
        '0x': IconName.Shimmer,
        '1': IconName.Shimmer,
    },
    [SupportedNetworkId.Testnet]: {
        '0x': IconName.Shimmer,
        '1': IconName.Shimmer,
    },
    [SupportedNetworkId.ShimmerEvm]: {
        '0x': IconName.Shimmer,
        '1': IconName.Shimmer,
    },
    [SupportedNetworkId.ShimmerEvmTestnet]: {
        '0x': IconName.Shimmer,
        '1': IconName.Shimmer,
    },
}
