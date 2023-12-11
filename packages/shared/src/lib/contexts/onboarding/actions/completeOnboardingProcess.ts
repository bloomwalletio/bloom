import { createNewAccount } from '@core/account/actions'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { getNetwork } from '@core/network'
import { generateAndStoreEvmAddressForAccounts } from '@core/layer-2/actions'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { loadAccounts } from '@core/profile/actions'
import { cleanupOnboarding } from './cleanupOnboarding'
import { IAccountState } from '@core/account'

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
    const coinType = getNetwork()?.getChains()?.[0]?.getConfiguration()?.coinType
    const strongholdUnlocked = await isStrongholdUnlocked()

    if (coinType && strongholdUnlocked) {
        await generateAndStoreEvmAddressForAccounts(type, coinType, ...accounts)
    }

    void cleanupOnboarding()
}
