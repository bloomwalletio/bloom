import { initializeRegisteredProposals, registerProposalsFromNodes } from '@contexts/governance/actions'
import { setSelectedAccount } from '@core/account/actions'
import { generateAndStoreActivitiesForAllAccounts } from '@core/activity/actions'
import { Platform } from '@core/app/classes'
import { AppContext } from '@core/app/enums'
import { handleError } from '@core/error/handlers'
import { fetchEvmBalancesForAllAccounts } from '@core/layer-2/utils'
import { pollLedgerDeviceState } from '@core/ledger/actions'
import { pollMarketPrices } from '@core/market/actions'
import { loadNftsForActiveProfile } from '@core/nfts/actions'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import {
    isStrongholdUnlocked,
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
} from '@core/profile-manager/api'
import { profileManager } from '@core/profile-manager/stores'
import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
import { routerManager } from '@core/router/stores'
import { loadTokensForAllAccountBalances } from '@core/token/actions'
import { SECONDS_PER_MINUTE } from '@core/utils'
import { get } from 'svelte/store'
import { ProfileType } from '../../enums'
import { ILoginOptions } from '../../interfaces'
import {
    activeAccounts,
    activeProfile,
    getLastLoggedInProfileId,
    incrementLoginProgress,
    lastLoggedInProfileId,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
    updateActiveProfile,
} from '../../stores'
import { isLedgerProfile, waitForPreviousManagerToBeDestroyed } from '../../utils'
// import { checkAndRemoveProfilePicture } from './checkAndRemoveProfilePicture'
import { checkAndInitializeActiveProfileNetwork } from './checkAndInitializeActiveProfileNetwork'
import { loadAccounts } from './loadAccounts'
import { logout } from './logout'
import { subscribeToWalletApiEventsForActiveProfile } from './subscribeToWalletApiEventsForActiveProfile'
import { disconnectAllDapps } from '@auxiliary/wallet-connect/utils'
import { cleanupOnboarding } from '@contexts/onboarding'
import { fetchAndPersistTransactionsForAccounts } from '@core/transactions/actions'
import { updateCirculatingSupplyForActiveProfile } from './updateCirculatingSupplyForActiveProfile'
import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
import { getEvmNetworks } from '@core/network'

export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const loginRouter = get(routerManager)?.getRouterForAppContext(AppContext.Login)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedAccountIndex } = _activeProfile
        if (!id) {
            throw Error('No active profile error')
        }

        // Step 1: create profile manager if its doesn't exist
        incrementLoginProgress()
        await waitForPreviousManagerToBeDestroyed()
        if (!get(profileManager)) {
            const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(_activeProfile)
            const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
            // Make sure the profile has the latest client options that we are using
            updateActiveProfile({ clientOptions })
            const manager = await initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, id)
            profileManager.set(manager)
        }

        // Step 2: get node info to check we have a synced node
        incrementLoginProgress()
        await checkAndInitializeActiveProfileNetwork()

        // Step 3: load accounts
        incrementLoginProgress()
        const loadedAccounts = await loadAccounts()

        // Step 4: load assets
        incrementLoginProgress()
        await loadTokensForAllAccountBalances(_activeProfile.forceAssetRefresh, _activeProfile.forceAssetRefresh)
        updateActiveProfile({ forceAssetRefresh: false })
        await loadNftsForActiveProfile()
        // checkAndRemoveProfilePicture()

        // Step 5: generate and store activities for all accounts
        incrementLoginProgress()
        void generateAndStoreActivitiesForAllAccounts(_activeProfile.id)

        if (type === ProfileType.Software) {
            // Step 6: set initial stronghold status
            incrementLoginProgress()
            const strongholdUnlocked = await isStrongholdUnlocked()
            isStrongholdLocked.set(!strongholdUnlocked)
            await setStrongholdPasswordClearInterval(
                _activeProfile.settings.strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE
            )
            if (strongholdUnlocked) {
                setTimeStrongholdLastUnlocked()
            }
        } else {
            incrementLoginProgress()
        }

        // Step 7: start background sync and fetch balances
        incrementLoginProgress()
        subscribeToWalletApiEventsForActiveProfile()
        await startBackgroundSync({ syncIncomingTransactions: true })
        fetchEvmBalancesForAllAccounts(_activeProfile.id)
        void fetchAndPersistTransactionsForAccounts(_activeProfile.id, get(activeAccounts))

        // Step 8: finish login
        incrementLoginProgress()
        if (isLedgerProfile(type)) {
            pollLedgerDeviceState()
        }

        if (getLastLoggedInProfileId() !== _activeProfile.id) {
            void disconnectAllDapps()
        }

        setSelectedAccount(lastUsedAccountIndex ?? loadedAccounts?.[0]?.index)
        lastLoggedInProfileId.set(_activeProfile.id)
        lastActiveAt.set(new Date())
        loggedIn.set(true)
        setTimeout(() => {
            loginRouter?.next()
            resetLoginProgress()
        }, 500)

        void pollMarketPrices()
        void updateCirculatingSupplyForActiveProfile()
        if (Platform.isFeatureFlagEnabled('governance')) {
            void initializeRegisteredProposals()
            void registerProposalsFromNodes(loadedAccounts)
        }
        void cleanupOnboarding()
        notificationsManager.setTrackedNetworkAccounts(
            loadedAccounts,
            getEvmNetworks().map(({ id }) => id)
        )
    } catch (err) {
        handleError(err)
        if (!loginOptions?.isFromOnboardingFlow) {
            logout(false)
        }
        loginRouter?.previous()
        resetLoginProgress()
    }
}
