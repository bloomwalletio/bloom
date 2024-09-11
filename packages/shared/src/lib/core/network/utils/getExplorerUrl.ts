import { buildUrl } from '@core/utils/url'
import { getExplorerEndpoint } from '../utils'
import { ExplorerEndpoint } from '../enums'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getExplorerUrl(
    networkId: NetworkId,
    requestedEndpoint: ExplorerEndpoint,
    pathParameter?: string
): string | undefined {
    const baseUrl = getNetwork(networkId)?.explorer?.url ?? ''
    const endpoint = getExplorerEndpoint(networkId, requestedEndpoint) ?? ''

    const url = buildUrl({ base: baseUrl, pathname: `${endpoint}${pathParameter ? '/' + pathParameter : ''}` })
    return url?.href
}
