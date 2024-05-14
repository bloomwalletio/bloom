import { get } from 'svelte/store'
import { localize } from '@core/i18n'
import { activeProfile } from '@core/profile/stores'
import { NetworkNamespace, initializeNetworks } from '@core/network'
import { getNodeInfo } from '@core/profile-manager'

export async function checkAndInitializeActiveProfileNetwork(): Promise<void> {
    const $activeProfile = get(activeProfile)
    const existingNetwork = $activeProfile?.network
    const nodeInfoResponse = await getNodeInfo()
    if (!nodeInfoResponse) {
        throw new Error(localize('error.network.mismatch'))
    }

    const networkIdFromNode = `${NetworkNamespace.Stardust}:${nodeInfoResponse?.nodeInfo?.protocol.networkName}`
    if (existingNetwork?.id !== networkIdFromNode) {
        throw new Error(localize('error.network.mismatch', { networkId: networkIdFromNode }))
    }

    if (existingNetwork?.protocol.version !== nodeInfoResponse?.nodeInfo?.protocol.version) {
        throw new Error(localize('error.network.version.mismatch', { networkId: networkIdFromNode }))
    }

    initializeNetworks()
}
