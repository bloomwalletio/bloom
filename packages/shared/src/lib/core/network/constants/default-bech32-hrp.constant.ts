import { SupportedNetworkId } from '../constants'
import { StardustNetworkId } from '../types'

export const IOTA_BECH32_HRP = 'iota'
export const SHIMMER_BECH32_HRP = 'smr'
export const TESTNET_BECH32_HRP = 'rms'

export const DEFAULT_BECH32_HRP: Readonly<{ [id in StardustNetworkId]?: string }> = {
    [SupportedNetworkId.Iota]: IOTA_BECH32_HRP,
    [SupportedNetworkId.Shimmer]: SHIMMER_BECH32_HRP,
    [SupportedNetworkId.Testnet]: TESTNET_BECH32_HRP,
}
