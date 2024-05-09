import { DEFAULT_EXPLORER_URLS, getExplorerEndpoint } from '../constants'
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
    const endpoint = getExplorerEndpoint(networkId, requestedEndpoint) ?? ''

    return {
        baseUrl,
        endpoint,
    }
}
