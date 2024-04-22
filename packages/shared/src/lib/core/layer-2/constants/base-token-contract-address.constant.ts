import { EvmNetworkId } from '@core/network/types'
import { SupportedIscNetworkId } from '@core/network/constants'

export const BASE_TOKEN_CONTRACT_ADDRESS: Readonly<{ [id in EvmNetworkId]?: string }> = {
    [SupportedIscNetworkId.ShimmerEvm]: '0x1074010000000000000000000000000000000000',
    [SupportedIscNetworkId.TestnetEvm]: '0x1074010000000000000000000000000000000000',
}
