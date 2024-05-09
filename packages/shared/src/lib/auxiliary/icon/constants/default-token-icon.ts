import { IconName } from '@bloomwalletio/ui'
import { NetworkId, SupportedNetworkId } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'

export const DEFAULT_TOKEN_ICON: { [networkId in NetworkId]?: { [tokenId: string]: IconName } } = {
    [SupportedNetworkId.Iota]: {
        [BASE_TOKEN_ID]: IconName.Iota,
    },
    [SupportedNetworkId.Shimmer]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
    [SupportedNetworkId.IotaTestnet]: {
        [BASE_TOKEN_ID]: IconName.Iota,
    },
    [SupportedNetworkId.Testnet]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
    [SupportedNetworkId.IotaEvm]: {
        [BASE_TOKEN_ID]: IconName.Iota,
    },
    [SupportedNetworkId.ShimmerEvm]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
    [SupportedNetworkId.TestnetEvm]: {
        [BASE_TOKEN_ID]: IconName.Shimmer,
    },
}
