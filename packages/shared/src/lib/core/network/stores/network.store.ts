import { Readable, derived, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { StardustNetwork } from '../classes'
import { IStardustNetwork } from '../interfaces'

export const network: Readable<IStardustNetwork | undefined> = derived([activeProfile], ([$activeProfile]) => {
    if ($activeProfile && $activeProfile.network) {
        return new StardustNetwork($activeProfile.network, $activeProfile.network.chainConfigurations)
    } else {
        return undefined
    }
})

export function getNetwork(): IStardustNetwork | undefined {
    return get(network)
}
