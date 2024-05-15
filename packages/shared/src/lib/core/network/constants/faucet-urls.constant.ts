import { StardustNetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const FAUCET_URLS: Readonly<{ [id in StardustNetworkId]?: string }> = {
    [SupportedNetworkId.IotaTestnet]: 'https://faucet.testnet.iotaledger.net/api/enqueue',
    [SupportedNetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
