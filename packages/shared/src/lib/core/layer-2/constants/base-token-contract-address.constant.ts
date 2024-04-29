import { EvmNetworkId } from '@core/network/types'
// Keep this specific import to mitigate circular dependencies when running tests
import { SupportedIscNetworkId } from '@core/network/constants/supported-network-id.constant'

export const BASE_TOKEN_CONTRACT_ADDRESS: Readonly<{ [id in EvmNetworkId]?: string }> = {
    [SupportedIscNetworkId.ShimmerEvm]: '0x1074010000000000000000000000000000000000',
    [SupportedIscNetworkId.TestnetEvm]: '0x1074010000000000000000000000000000000000',
}
