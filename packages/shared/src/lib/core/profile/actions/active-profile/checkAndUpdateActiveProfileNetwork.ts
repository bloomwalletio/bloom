import { get } from 'svelte/store'
import { localize } from '@core/i18n'
import { getAndUpdateNodeInfo } from '@core/network/actions'
import { buildPersistedNetworkFromNodeInfoResponse } from '@core/network/utils'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { initializeNetworks } from '@core/network'

export async function checkAndUpdateActiveProfileNetwork(): Promise<void> {
    const $activeProfile = get(activeProfile)
    const existingNetwork = $activeProfile?.network
    const nodeInfoResponse = await getAndUpdateNodeInfo(true)
    if (!nodeInfoResponse) {
        return
    }

    const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse, existingNetwork.coinType)
    if (existingNetwork?.id === network.id) {
        network.chainConfigurations = $activeProfile.network?.chainConfigurations || []
        updateActiveProfile({ network })
        initializeNetworks()
    } else {
        throw new Error(localize('error.network.mismatch', { networkId: network.id }))
    }
}
