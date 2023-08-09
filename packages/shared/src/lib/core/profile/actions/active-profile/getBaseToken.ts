import { activeProfile } from '@core/profile/stores'
import { IBaseToken } from '@core/token/interfaces'
import { get } from 'svelte/store'

export function getBaseToken(): IBaseToken {
    const $activeProfile = get(activeProfile)
    return $activeProfile?.network?.baseToken
}
