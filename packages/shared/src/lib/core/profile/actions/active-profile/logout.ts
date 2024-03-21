import { get } from 'svelte/store'

import { resetSelectedAccountIndex } from '@core/account/actions'
import {
    clearSelectedParticipationEventStatus,
    resetProposalOverviews,
    resetRegisteredProposals,
} from '@contexts/governance/stores'
import { stopPollingLedgerDeviceState } from '@core/ledger/actions'
import { isPollingLedgerDeviceState } from '@core/ledger/stores'
import { clearMarketPricesPoll } from '@core/market/actions'
import { clearChainStatusesPoll, clearNetworkPoll } from '@core/network/actions'
import { stopDownloadingNftMediaFromQueue } from '@core/nfts/actions'
import { lockStronghold, resetActiveProfile } from '@core/profile/actions'
import { activeAccounts, activeProfile, isSoftwareProfile, isDestroyingManager } from '@core/profile/stores'
import { isLedgerProfile } from '@core/profile/utils'
import { destroyProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager/actions'
import { IProfileManager } from '@core/profile-manager/interfaces'
import { profileManager } from '@core/profile-manager/stores'
import { routerManager } from '@core/router/stores'
import { clearFilters } from '@core/utils/clearFilters'
import { closePopup } from '../../../../../../../desktop/lib/auxiliary/popup'
import { closeDrawer } from '../../../../../../../desktop/lib/auxiliary/drawer'
import { closeSettings } from '@contexts/settings/stores'
import { clearLayer2Balance } from '@core/layer-2/stores'
import { clearAccountNfts } from '@core/nfts/stores'
import { clearAccountActivities } from '@core/activity/stores'

/**
 * Logout from active profile
 */
export function logout(clearActiveProfile = true, _lockStronghold = true): void {
    if (get(isSoftwareProfile)) {
        _lockStronghold && lockStronghold()
    } else if (isLedgerProfile(get(activeProfile).type)) {
        get(isPollingLedgerDeviceState) && stopPollingLedgerDeviceState()
    }

    closePopup()
    closeDrawer()
    closeSettings()

    clearNetworkPoll()
    clearLayer2Balance()
    clearChainStatusesPoll()
    clearMarketPricesPoll()
    clearAccountNfts()
    clearAccountActivities()

    const _activeProfile = get(activeProfile)
    if (_activeProfile) {
        const manager = get(profileManager)
        void destroyWalletRsObjects(manager)
    }

    cleanupProfileState(clearActiveProfile)
}

function cleanupProfileState(clearActiveProfile: boolean): void {
    const { lastActiveAt, loggedIn, hasLoadedAccounts } = get(activeProfile)

    loggedIn.set(false)
    lastActiveAt.set(new Date())
    hasLoadedAccounts.set(false)
    resetSelectedAccountIndex()

    void stopDownloadingNftMediaFromQueue()

    // Governance Stores
    resetRegisteredProposals()
    resetProposalOverviews()
    clearSelectedParticipationEventStatus()

    activeAccounts.set([])
    if (clearActiveProfile) {
        resetActiveProfile()
    }
    clearFilters()
    get(routerManager)?.resetRouters()
}

async function destroyWalletRsObjects(manager?: IProfileManager): Promise<void> {
    isDestroyingManager.set(true)
    await manager?.stopBackgroundSync()
    await unsubscribeFromWalletApiEvents()
    await destroyProfileManager()
    isDestroyingManager.set(false)
}
