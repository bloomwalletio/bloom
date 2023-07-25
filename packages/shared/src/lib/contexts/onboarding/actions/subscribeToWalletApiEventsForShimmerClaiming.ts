import { get } from 'svelte/store'
import { handleTransactionInclusionEventForShimmerClaiming } from './handleTransactionInclusionEventForShimmerClaiming'

import { handleTransactionProgressEvent, subscribeToWalletApiEvents, WalletApiEventMap } from '@core/profile-manager'

import { shimmerClaimingProfileManager } from '../stores'

import { WalletEventType } from '@iota/wallet/out/types'

export function subscribeToWalletApiEventsForShimmerClaiming(): void {
    const profileManager = get(shimmerClaimingProfileManager)
    const eventMap: WalletApiEventMap = {
        [WalletEventType.TransactionInclusion]: handleTransactionInclusionEventForShimmerClaiming,
        [WalletEventType.TransactionProgress]: handleTransactionProgressEvent,
    }

    subscribeToWalletApiEvents({
        eventMap,
        profileManager,
    })
}
