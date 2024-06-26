import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const BASE_TOKEN_SUPPLY_FOR_NETWORK: Readonly<{ [id in NetworkId]: bigint }> = {
    [SupportedNetworkId.Iota]: BigInt('4600000000000000'),
    [SupportedNetworkId.Shimmer]: BigInt('1813620509061365'),
    [SupportedNetworkId.IotaTestnet]: BigInt('4600000000000000'),
    [SupportedNetworkId.Testnet]: BigInt('1450896407249092'),
}
