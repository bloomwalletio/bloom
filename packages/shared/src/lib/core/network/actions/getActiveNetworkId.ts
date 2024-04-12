import { getActiveProfile } from '@core/profile/stores/active-profile.store'
import { StardustNetworkId } from '../types'

export function getActiveNetworkId(): StardustNetworkId {
    const networkId = getActiveProfile()?.network?.id
    if (!networkId) {
        throw new Error('Network is undefined!')
    }
    return networkId
}
