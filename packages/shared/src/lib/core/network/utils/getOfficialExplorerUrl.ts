import { EXPLORER_URLS } from '../constants'
import { NetworkId } from '../types'

export function getOfficialExplorerUrl(networkId: NetworkId): string {
    return EXPLORER_URLS?.[networkId] ?? ''
}
