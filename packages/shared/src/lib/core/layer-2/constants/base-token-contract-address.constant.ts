import { SupportedNetworkId } from '@core/network'

export const BASE_TOKEN_CONTRACT_ADDRESS: { [id in SupportedNetworkId]?: string } = {
    [SupportedNetworkId.ShimmerEvm]: '0x1074010000000000000000000000000000000000',
    [SupportedNetworkId.TestnetEvm]: '0x1074010000000000000000000000000000000000',
}
