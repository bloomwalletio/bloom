import { NetworkId, SupportedNetworkId } from '@core/network'
import { TRANSAK_PRODUCTION_WIDGET_URL, TRANSAK_STAGING_WIDGET_URL } from '../constants'

export function getTransakWidgetUrl(networkId: NetworkId): string {
    switch (networkId) {
        case SupportedNetworkId.Iota:
        case SupportedNetworkId.Shimmer:
            return TRANSAK_PRODUCTION_WIDGET_URL
        default:
            return TRANSAK_STAGING_WIDGET_URL
    }
}
