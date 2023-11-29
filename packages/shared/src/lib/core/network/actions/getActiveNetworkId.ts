import { getActiveProfile } from '@core/profile/stores/active-profile.store'
import { NetworkId } from '../types'

export function getActiveNetworkId(): NetworkId {
    const networkId = getActiveProfile()?.network?.id
    if (!networkId) {
        throw new Error('Network is undefined!')
    }
    return networkId
}
