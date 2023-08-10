import { TangleNetworkId } from '../enums'
import { NetworkIdType } from '../types'
import { buildTangleNetworkId } from '../utils'

export const OFFICIAL_NODE_URLS: Readonly<{ [id: NetworkIdType]: string[] }> = {
    [buildTangleNetworkId(TangleNetworkId.Iota)]: [
        'https://chrysalis-nodes.iota.org',
        'https://chrysalis-nodes.iota.cafe',
        'https://iota-node.tanglebay.com',
    ],
    [buildTangleNetworkId(TangleNetworkId.Shimmer)]: ['https://api.shimmer.network'],
    [buildTangleNetworkId(TangleNetworkId.Testnet)]: ['https://api.testnet.shimmer.network'],
}
