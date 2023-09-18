import { initializeWalletConnect } from '@auxiliary/wallet-connect/actions'
import { initializeRegisteredProposals, registerProposalsFromNodes } from '@contexts/governance/actions'
import { cleanupOnboarding } from '@contexts/onboarding/actions'
import { createNewAccount, setSelectedAccount } from '@core/account/actions'
import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
import { IAccount, IAccountState } from '@core/account/interfaces'
import { generateAndStoreActivitiesForAllAccounts } from '@core/activity/actions'
import { Platform } from '@core/app/classes'
import { AppContext } from '@core/app/enums'
import { handleError } from '@core/error/handlers'
import { pollLedgerDeviceState } from '@core/ledger/actions'
import { pollMarketPrices } from '@core/market/actions'
import { pollChainStatuses, pollNetworkStatus } from '@core/network/actions'
import { loadNftsForActiveProfile } from '@core/nfts/actions'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import {
    getAccounts,
    isStrongholdUnlocked,
    recoverAccounts,
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
} from '@core/profile-manager/api'
import { RecoverAccountsPayload } from '@core/profile-manager/interfaces'
import { profileManager } from '@core/profile-manager/stores'
import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
import { routerManager } from '@core/router/stores'
import { SECONDS_PER_MINUTE } from '@core/utils'
import { get } from 'svelte/store'
import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '../../constants'
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
import { refreshAccountTokensForActiveProfile } from '@core/token/actions'
import { generateAndStoreEvmAddressForAccounts, updateEvmChainGasPrices } from '@core/layer-2/actions'
import { getNetwork } from '@core/network'

export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const loginRouter = get(routerManager).getRouterForAppContext(AppContext.Login)
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
        await checkAndUpdateActiveProfileNetwork()
        void pollNetworkStatus()
        void pollChainStatuses()
        void updateEvmChainGasPrices()

        // Step 3: load and build all the profile data
        incrementLoginProgress()
        let accounts: IAccount[]
        if (loginOptions?.isFromOnboardingFlow && loginOptions?.shouldRecoverAccounts) {
            const { initialAccountRange, addressGapLimit } = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type]
            const recoverAccountsPayload: RecoverAccountsPayload = {
                accountStartIndex: 0,
                accountGapLimit: initialAccountRange,
                addressGapLimit,
                syncOptions: DEFAULT_SYNC_OPTIONS,
            }
            accounts = await recoverAccounts(recoverAccountsPayload)
        } else {
            accounts = await getAccounts()
        }
        /**
         * NOTE: In the case no accounts with funds were recovered, we must
         * create one for the new profile.
         */
        if (accounts?.length === 0) {
            const newAccount = await createNewAccount()
            accounts.push(newAccount)
        }

        // Step 4: load accounts
        incrementLoginProgress()
        await loadAccounts()

        // Step 5: load assets
        incrementLoginProgress()
        await refreshAccountTokensForActiveProfile(_activeProfile.forceAssetRefresh, _activeProfile.forceAssetRefresh)
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

            const coinType = getNetwork()?.getChains()?.[0]?.getConfiguration()?.coinType
            if (coinType && strongholdUnlocked) {
                void generateAndStoreEvmAddressForAccounts(type, coinType, ...(accounts as IAccountState[]))
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
            pollLedgerDeviceState()
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
    } catch (err) {
        handleError(err)
        if (!loginOptions?.isFromOnboardingFlow) {
            logout(false)
        }
        loginRouter?.previous()
        resetLoginProgress()
    }
}
