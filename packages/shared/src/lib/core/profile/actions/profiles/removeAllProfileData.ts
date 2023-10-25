import { removePersistedShimmerClaimingTransactions } from '@contexts/onboarding'
import {
    removeClaimedActivitiesForProfile,
    removeHiddenActivitiesForProfile,
    removePersistedBalanceChangesForProfile,
    removePersistedEvmTransactionsForProfile,
} from '@core/activity/stores'
import { removePersistedNftsForProfile } from '@core/nfts/stores'
import { removePersistedProfile } from '@core/profile/stores'
import { removePersistedTokensForProfile } from '@core/token/stores'

export function removeAllProfileData(profileId: string): void {
    removePersistedProfile(profileId)
    removePersistedEvmTransactionsForProfile(profileId)
    removePersistedBalanceChangesForProfile(profileId)
    removeClaimedActivitiesForProfile(profileId)
    removePersistedNftsForProfile(profileId)
    removePersistedTokensForProfile(profileId)
    removePersistedShimmerClaimingTransactions(profileId)
    removeHiddenActivitiesForProfile(profileId)
}
