import { IAccount, sumTotalFromOutputs } from '@core/account'
import { filterShimmerClaimingOutputs } from '@core/utils'

export async function sumTotalUnclaimedRewards(accounts: IAccount[]): Promise<bigint> {
    let totalUnclaimedRewards = BigInt(0)

    for (const account of accounts) {
        const unspentOutputs = (await account?.unspentOutputs())?.filter(filterShimmerClaimingOutputs)
        totalUnclaimedRewards += sumTotalFromOutputs(unspentOutputs)
    }

    return totalUnclaimedRewards
}
