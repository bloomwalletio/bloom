import { SupportedNetworkId } from '../constants'
import { StardustNetworkId } from '../types'

export const FAUCET_URLS: Readonly<{ [id in StardustNetworkId]?: string }> = {
    [SupportedNetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
