import { getExplorerEndpoint } from '../constants'
import { ExplorerEndpoint } from '../enums'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getExplorerUrl(
    networkId: NetworkId,
    requestedEndpoint: ExplorerEndpoint
): {
    baseUrl: string
    endpoint: string
} {
    const baseUrl = getNetwork(networkId)?.explorerUrl ?? ''
    const endpoint = getExplorerEndpoint(networkId, requestedEndpoint) ?? ''

    return {
        baseUrl,
        endpoint,
    }
}
