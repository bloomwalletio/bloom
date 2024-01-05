import { Transaction } from '@iota/sdk/out/types'

import { IAccount } from '@core/account'

import { ShimmerClaimingAccountState } from '../enums'

export interface IShimmerClaimingAccount extends IAccount {
    twinAccount: IAccount
    state: ShimmerClaimingAccountState
    claimedRewards: bigint
    unclaimedRewards: bigint
    claimingTransaction?: Transaction
}
