import { buildUrl } from '@core/utils/url'
import { getExplorerEndpoint } from '../constants'
import { ExplorerEndpoint } from '../enums'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getExplorerUrl(
    networkId: NetworkId,
    requestedEndpoint: ExplorerEndpoint,
    pathParameter?: string
): string | undefined {
    const baseUrl = getNetwork(networkId)?.explorerUrl ?? ''
    const endpoint = getExplorerEndpoint(networkId, requestedEndpoint) ?? ''

    const url = buildUrl({ origin: baseUrl, pathname: `${endpoint}${pathParameter ? '/' + pathParameter : ''}` })
    return url?.href
}
