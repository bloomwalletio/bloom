import { TangleNetworkId } from '../enums'
import { NetworkIdType } from '../types'
import { buildTangleNetworkId } from '../utils'

export const FAUCET_URLS: Readonly<{ [id: NetworkIdType]: string }> = {
    [buildTangleNetworkId(TangleNetworkId.Testnet)]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
