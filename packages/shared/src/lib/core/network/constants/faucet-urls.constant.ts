import { SupportedNetworkId } from '../enums'

export const FAUCET_URLS: Readonly<{ [id in SupportedNetworkId]?: string }> = {
    [SupportedNetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
