import { Output } from '@iota/sdk'

import { tryNumberOrZero } from '@core/utils'

import { IShimmerClaimingAccount } from '../interfaces'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): number {
    return shimmerClaimingAccounts?.reduce(
        (total: number, curr: IShimmerClaimingAccount) =>
            total +
            tryNumberOrZero(
                curr?.claimingTransaction?.payload?.essence?.outputs?.reduce(
                    (outputsTotal: number, currentOutput: Output) =>
                        outputsTotal + tryNumberOrZero(currentOutput?.amount),
                    0
                )
            ),
        0
    )
}
