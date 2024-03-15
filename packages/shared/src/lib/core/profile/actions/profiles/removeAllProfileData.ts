import { removePersistedShimmerClaimingTransactions } from '@contexts/onboarding'
import {
    removeClaimedActivitiesForProfile,
    removeHiddenActivitiesForProfile,
    removePersistedBalanceChangesForProfile,
} from '@core/activity/stores'
import { removePersistedNftsForProfile } from '@core/nfts/stores'
import { removePersistedProfile } from '@core/profile/stores'
import { removePersistedTokensForProfile } from '@core/token/stores'
import { removePersistedTransactionsForProfile } from '@core/transactions/stores'

export function removeAllProfileData(profileId: string): void {
    removePersistedProfile(profileId)
    removePersistedTransactionsForProfile(profileId)
    removePersistedBalanceChangesForProfile(profileId)
    removeClaimedActivitiesForProfile(profileId)
    removePersistedNftsForProfile(profileId)
    removePersistedTokensForProfile(profileId)
    removePersistedShimmerClaimingTransactions(profileId)
    removeHiddenActivitiesForProfile(profileId)
}
