import { get } from 'svelte/store'
import { activeProfile } from '@core/profile/stores/active-profile.store'
import { NetworkIdType } from '../types'

export function getActiveNetworkId(): NetworkIdType | undefined {
    return get(activeProfile)?.network?.id
}
