import { StardustNetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const FAUCET_URLS: Readonly<{ [id in StardustNetworkId]?: string }> = {
    [SupportedNetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
