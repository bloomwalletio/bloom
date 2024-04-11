import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export const FAUCET_URLS: Readonly<{ [id in NetworkId]?: string }> = {
    [SupportedNetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
