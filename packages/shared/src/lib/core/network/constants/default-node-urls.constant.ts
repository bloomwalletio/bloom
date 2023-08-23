import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export const DEFAULT_NODE_URLS: Readonly<{ [id in NetworkId]?: string[] }> = {
    [SupportedNetworkId.Shimmer]: ['https://api.shimmer.network'],
    [SupportedNetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
}
