import { NetworkId } from '@core/network'
import { SupportedEvmNetworkId } from '@core/network/enums'

export const BASE_TOKEN_CONTRACT_ADDRESS: Readonly<{ [id in NetworkId]?: string }> = {
    [SupportedEvmNetworkId.ShimmerEvm]: '0x1074010000000000000000000000000000000000',
    [SupportedEvmNetworkId.TestnetEvm]: '0x1074010000000000000000000000000000000000',
}
