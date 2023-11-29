import { getUnitFromTokenMetadata } from '../utils'
import { MAX_ASSET_DISPLAYED_INITIALS } from '../constants'
import { IPersistedToken } from '../interfaces'
import { getInitials } from '@core/utils/string'

export function getTokenInitials(token: IPersistedToken): string {
    const unit = getUnitFromTokenMetadata(token?.metadata)
    return unit
        ? unit?.slice(0, MAX_ASSET_DISPLAYED_INITIALS)
        : getInitials(token?.metadata?.name, MAX_ASSET_DISPLAYED_INITIALS)
}
