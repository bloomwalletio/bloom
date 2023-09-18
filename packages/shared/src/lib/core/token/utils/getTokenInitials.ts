import { getInitials } from '@core/utils/string'
import { MAX_ASSET_DISPLAYED_INITIALS } from '../constants'
import { IPersistedToken } from '../interfaces'
import { getUnitFromTokenMetadata } from '../utils'

export function getTokenInitials(token: IPersistedToken): string {
    const unit = getUnitFromTokenMetadata(token?.metadata)
    return unit
        ? unit?.slice(0, MAX_ASSET_DISPLAYED_INITIALS)
        : getInitials(token?.metadata?.name, MAX_ASSET_DISPLAYED_INITIALS)
}
