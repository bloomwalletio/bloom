import { NetworkNamespace, TangleNetworkId } from '../enums'
import { NetworkIdType } from '../types'
import { buildNetworkId } from '../utils'

export const OFFICIAL_NODE_URLS: Readonly<{ [id: NetworkIdType]: string[] }> = {
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Iota)]: [
        'https://chrysalis-nodes.iota.org',
        'https://chrysalis-nodes.iota.cafe',
        'https://iota-node.tanglebay.com',
    ],
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Shimmer)]: ['https://api.shimmer.network'],
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Testnet)]: ['https://api.testnet.shimmer.network'],
}
