import { IAccountState } from '@core/account'
import { createNewAccount } from '@core/account/actions'
import { generateAndStoreEvmAddressForAccounts } from '@core/layer-2/actions'
import { ProfileType } from '@core/profile'
import { loadAccounts } from '@core/profile/actions'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { onboardingProfile } from '../stores'
import { cleanupOnboarding } from './cleanupOnboarding'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { notificationsManager } from '@auxiliary/wallet-connect/notifications'

export async function completeOnboardingProcess(): Promise<void> {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    const onboardingType = get(onboardingProfile)?.onboardingType
    let accounts: IAccountState[] = []
    if (onboardingType === OnboardingType.Create) {
        const newAccount = await createNewAccount()
        accounts = [newAccount]
    } else {
        accounts = (await loadAccounts()) ?? []
    }

    const { type } = get(activeProfile)

    if (type === ProfileType.Software) {
        const { network, evmNetworks } = get(activeProfile)
        const networks = [...network.chainConfigurations, ...(evmNetworks ?? [])]
        for (const network of networks) {
            await generateAndStoreEvmAddressForAccounts(type, network.coinType, ...accounts)
            try {
                await notificationsManager.registerAccount(accounts[0], network.id, network.coinType)
            } catch (error) {
                console.error(error)
            }
        }
    }

    void cleanupOnboarding()
}
