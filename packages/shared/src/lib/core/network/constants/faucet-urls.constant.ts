import { TangleNetworkId } from '../enums'
import { NetworkId } from '../types'
import { buildTangleNetworkId } from '../utils'

export const FAUCET_URLS: Readonly<{ [id: NetworkId]: string }> = {
    [buildTangleNetworkId(TangleNetworkId.Testnet)]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
