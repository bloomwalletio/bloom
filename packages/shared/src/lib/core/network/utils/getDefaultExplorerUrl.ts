import { DEFAULT_EXPLORER_URLS, EXPLORER_ENDPOINTS } from '../constants'
import { ExplorerEndpoint } from '../enums'
import { NetworkId } from '../types'

export function getDefaultExplorerUrl(
    networkId: NetworkId,
    requestedEndpoint: ExplorerEndpoint
): {
    baseUrl: string
    endpoint: string
} {
    const baseUrl = DEFAULT_EXPLORER_URLS?.[networkId] ?? ''
    const endpoint = EXPLORER_ENDPOINTS?.[networkId]?.[requestedEndpoint] ?? ''

    return {
        baseUrl,
        endpoint,
    }
}
