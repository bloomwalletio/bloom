import { DEFAULT_EXPLORER_URLS, EXPLORER_ENDPOINTS } from '../constants'
import { ExplorerEndpoint } from '../enums'
import { NetworkId } from '../types'

export function getDefaultExplorerUrl(networkId: NetworkId, requestedEndpoint: ExplorerEndpoint): string | undefined {
    const baseUrl = DEFAULT_EXPLORER_URLS?.[networkId]
    const endpoint = EXPLORER_ENDPOINTS?.[networkId]?.[requestedEndpoint]
    if (baseUrl && endpoint) {
        return `${baseUrl}/${endpoint}`
    } else {
        return undefined
    }
}
