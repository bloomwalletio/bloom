import { Transaction } from '@iota/sdk'

import { IAccount } from '@core/account'

import { ShimmerClaimingAccountState } from '../enums'

export interface IShimmerClaimingAccount extends IAccount {
    twinAccount: IAccount
    state: ShimmerClaimingAccountState
    claimedRewards: number
    unclaimedRewards: number
    claimingTransaction?: Transaction
}
