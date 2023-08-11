import { EXPLORER_URLS } from '../constants'
import { NetworkIdType } from '../types'

export function getOfficialExplorerUrl(networkId: NetworkIdType): string {
    return EXPLORER_URLS?.[networkId] ?? ''
}
