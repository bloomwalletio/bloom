import { initializeWalletConnect } from '@auxiliary/wallet-connect'
import { initializeRegisteredProposals, registerProposalsFromNodes } from '@contexts/governance/actions'
import { cleanupOnboarding } from '@contexts/onboarding/actions'
import { createNewAccount, setSelectedAccount } from '@core/account/actions'
import { Platform } from '@core/app/classes'
import { AppContext } from '@core/app/enums'
import { handleError } from '@core/error/handlers'
import { pollLedgerNanoStatus } from '@core/ledger/actions'
import { pollMarketPrices } from '@core/market/actions'
import { pollChainStatuses, pollNetworkStatus } from '@core/network/actions'
import { loadNftsForActiveProfile } from '@core/nfts'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import {
    getAccounts,
    isStrongholdUnlocked,
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
} from '@core/profile-manager/api'
import { profileManager } from '@core/profile-manager/stores'
import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
import { routerManager } from '@core/router/stores'
import { SECONDS_PER_MINUTE } from '@core/utils'
import { generateAndStoreActivitiesForAllAccounts, refreshAccountAssetsForActiveProfile } from '@core/wallet/actions'
import { get } from 'svelte/store'
import { ProfileType } from '../../enums'
import { ILoginOptions } from '../../interfaces'
import {
    activeAccounts,
    activeProfile,
    incrementLoginProgress,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
    updateActiveProfile,
} from '../../stores'
import { isLedgerProfile, waitForPreviousManagerToBeDestroyed } from '../../utils'
import { checkAndRemoveProfilePicture } from './checkAndRemoveProfilePicture'
import { checkAndUpdateActiveProfileNetwork } from './checkAndUpdateActiveProfileNetwork'
import { loadAccounts } from './loadAccounts'
import { logout } from './logout'
import { subscribeToWalletApiEventsForActiveProfile } from './subscribeToWalletApiEventsForActiveProfile'

export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const loginRouter = get(routerManager).getRouterForAppContext(AppContext.Login)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedAccountIndex } = _activeProfile
        if (id) {
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
            await checkAndUpdateActiveProfileNetwork()
            void pollNetworkStatus()
            void pollChainStatuses()

            // Step 3: load and build all the profile data
            incrementLoginProgress()
            incrementLoginProgress()
            const accounts = await getAccounts()
            if (accounts?.length === 0) {
                await createNewAccount()
            }
            await loadAccounts()

            // Step 5: load assets
            incrementLoginProgress()
            await refreshAccountAssetsForActiveProfile(
                _activeProfile.forceAssetRefresh,
                _activeProfile.forceAssetRefresh
            )
            updateActiveProfile({ forceAssetRefresh: false })
            await loadNftsForActiveProfile()
            checkAndRemoveProfilePicture()

            // Step 6: generate and store activities for all accounts
            incrementLoginProgress()
            await generateAndStoreActivitiesForAllAccounts()

            if (type === ProfileType.Software) {
                // Step 7: set initial stronghold status
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
                Platform.startLedgerProcess()
                incrementLoginProgress(2)
            }

            // Step 8: start background sync
            incrementLoginProgress()
            subscribeToWalletApiEventsForActiveProfile()
            await startBackgroundSync({ syncIncomingTransactions: true })

            // Step 9: finish login
            incrementLoginProgress()
            if (isLedgerProfile(type)) {
                pollLedgerNanoStatus()
            }

            setSelectedAccount(lastUsedAccountIndex ?? get(activeAccounts)?.[0]?.index ?? null)
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                loginRouter?.next()
                resetLoginProgress()
            }, 500)

            void pollMarketPrices()
            if (Platform.isFeatureFlagEnabled('governance')) {
                void initializeRegisteredProposals()
                void registerProposalsFromNodes(get(activeAccounts))
            }
            void cleanupOnboarding()
            void initializeWalletConnect()
        } else {
            throw Error('No active profile error')
        }
    } catch (err) {
        handleError(err)
        if (!loginOptions?.isFromOnboardingFlow) {
            logout(false)
        }
        loginRouter?.previous()
        resetLoginProgress()
    }
}
