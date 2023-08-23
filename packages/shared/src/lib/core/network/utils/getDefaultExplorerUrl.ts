import { DEFAULT_EXPLORER_URLS } from '../constants'
import { NetworkId } from '../types'

export function getDefaultExplorerUrl(networkId: NetworkId): string {
    return DEFAULT_EXPLORER_URLS?.[networkId] ?? ''
}
