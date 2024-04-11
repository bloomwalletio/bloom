import { NetworkId } from '@core/network'
import { EvmNetworkId } from '@core/network/enums'

export const BASE_TOKEN_CONTRACT_ADDRESS: Readonly<{ [id in NetworkId]?: string }> = {
    [EvmNetworkId.ShimmerEvm]: '0x1074010000000000000000000000000000000000',
    [EvmNetworkId.TestnetEvm]: '0x1074010000000000000000000000000000000000',
}
