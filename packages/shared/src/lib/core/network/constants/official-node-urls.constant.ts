import { SupportedNetworkId } from '../enums'
import { NetworkIdType } from '../types'

export const OFFICIAL_NODE_URLS: Readonly<{ [id: NetworkIdType]: string[] }> = {
    [SupportedNetworkId.Iota]: [
        'https://chrysalis-nodes.iota.org',
        'https://chrysalis-nodes.iota.cafe',
        'https://iota-node.tanglebay.com',
    ],
    [SupportedNetworkId.Shimmer]: ['https://api.shimmer.network'],
    [SupportedNetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
}
