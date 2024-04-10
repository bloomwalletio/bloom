import { IAccountState } from '@core/account'
import { createNewAccount } from '@core/account/actions'
import { generateAndStoreEvmAddressForAccounts } from '@core/layer-2/actions'
import { getNetwork } from '@core/network'
import { ProfileType } from '@core/profile'
import { loadAccounts } from '@core/profile/actions'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { onboardingProfile } from '../stores'
import { cleanupOnboarding } from './cleanupOnboarding'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'

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
        const coinType = getNetwork()?.getChains()?.[0]?.coinType
        if (coinType !== undefined) {
            await generateAndStoreEvmAddressForAccounts(type, coinType, ...accounts)
        }
    }

    void cleanupOnboarding()
}
