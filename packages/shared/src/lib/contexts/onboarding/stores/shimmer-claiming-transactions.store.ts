import { get, Writable } from 'svelte/store'

import { MissingTransactionIdError } from '@core/wallet'
import { persistent } from '@core/utils/store'

import { IShimmerClaimingTransactionStore } from '../interfaces'

import { onboardingProfile } from './onboarding-profile.store'

export const shimmerClaimingTransactions: Writable<IShimmerClaimingTransactionStore> = persistent(
    'shimmerClaimingTransactions',
    {}
)

export function persistShimmerClaimingTransaction(transactionId: string): void {
    if (!transactionId) {
        throw new MissingTransactionIdError()
    }
    const profileId = get(onboardingProfile)?.id
    if (!profileId) {
        throw new Error('Missing onboarding profile!')
    }

    shimmerClaimingTransactions.update((_shimmerClaimingTransactions) => {
        if (profileId in _shimmerClaimingTransactions) {
            _shimmerClaimingTransactions[profileId][transactionId] = true
        } else {
            _shimmerClaimingTransactions[profileId] = { [transactionId]: true }
        }
        return _shimmerClaimingTransactions
    })
}

export function removePersistedShimmerClaimingTransactions(profileId?: string): void {
    profileId = profileId ? profileId : get(onboardingProfile)?.id
    if (profileId) {
        const _shimmerClaimingTransactions = get(shimmerClaimingTransactions)
        delete _shimmerClaimingTransactions[profileId]
        shimmerClaimingTransactions.set(_shimmerClaimingTransactions)
    }
}
