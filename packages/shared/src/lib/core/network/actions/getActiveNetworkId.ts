import { get } from 'svelte/store'
import { activeProfile } from '@core/profile/stores/active-profile.store'
import { NetworkId } from '../types'

export function getActiveNetworkId(): NetworkId | undefined {
    return get(activeProfile)?.network?.id
}
