import { NetworkNamespace, TangleNetworkId } from '../enums'
import { NetworkIdType } from '../types'
import { buildNetworkId } from '../utils'

export const FAUCET_URLS: Readonly<{ [id: NetworkIdType]: string }> = {
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Testnet)]:
        'https://faucet.testnet.shimmer.network/api/enqueue',
}
