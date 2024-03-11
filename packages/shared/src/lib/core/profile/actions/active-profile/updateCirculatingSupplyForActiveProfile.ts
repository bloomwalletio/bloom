import { StardustNetworkId } from '@core/network/enums'
import { ExplorerApi } from '@core/network/apis'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function updateCirculatingSupplyForActiveProfile(): Promise<void> {
    const $profile = get(activeProfile)
    const circulatingSupply = await ExplorerApi.getCirculatingSupply($profile.network.id as StardustNetworkId)
    activeProfile.update((state) => {
        state.network.protocol.circulatingSupply = circulatingSupply
        return state
    })
}
