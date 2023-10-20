import { showNotification } from '@auxiliary/notification'
import { setTotalUnclaimedShimmerRewards } from '@contexts/onboarding'
import { IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { getAccount, profileManager } from '@core/profile-manager'
import { formatTokenAmountBestMatch } from '@core/token'
import { get } from 'svelte/store'
import { MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { getOnboardingBaseToken, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'

export async function syncShimmerClaimingAccount(account: IAccount): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }
    const { index } = account?.getMetadata() ?? {}
    const boundShimmerClaimingAccount = await getAccount(index, shimmerClaimingProfileManager)
    const boundTwinAccount = await getAccount(index, profileManager)

    const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
        boundShimmerClaimingAccount,
        boundTwinAccount,
        true
    )

    if (syncedShimmerClaimingAccount?.unclaimedRewards > 0) {
        const foundRewardsAmount = syncedShimmerClaimingAccount?.unclaimedRewards
        const foundRewardsAmountFormatted = formatTokenAmountBestMatch(foundRewardsAmount, getOnboardingBaseToken())

        showNotification({
            variant: 'success',
            text: localize('views.onboarding.restoreProfile.claimFinder.success', {
                values: { amount: foundRewardsAmountFormatted },
            }),
        })
        setTotalUnclaimedShimmerRewards(syncedShimmerClaimingAccount?.unclaimedRewards)
    }

    updateShimmerClaimingAccount(syncedShimmerClaimingAccount)
}
