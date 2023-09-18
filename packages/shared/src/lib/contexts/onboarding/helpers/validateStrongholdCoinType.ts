import { get, Writable } from 'svelte/store'
import { localize } from '@core/i18n'
import { DEFAULT_COIN_TYPE, NetworkId } from '@core/network'
import { createAccount, getAccounts, IProfileManager } from '@core/profile-manager'
import { OnboardingType } from '../enums'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile } from '../stores'

export async function validateStrongholdCoinType(
    profileManager: Writable<IProfileManager>,
    networkId: NetworkId
): Promise<void> {
    const accounts = await getAccounts(profileManager)
    if (accounts?.length === 0) {
        const alias = `${localize('general.account')} 1`
        const account = await createAccount({ alias }, profileManager)
        accounts.push(account)
    }

    if (accounts[0]?.getMetadata()?.coinType !== DEFAULT_COIN_TYPE[networkId]) {
        const isClaiming = get(onboardingProfile)?.onboardingType === OnboardingType.Claim
        throw new CannotRestoreWithMismatchedCoinTypeError(isClaiming)
    }
}
