import { getBalance } from '@core/account/api'

export async function getVotingPower(index: number): Promise<bigint> {
    const balance = await getBalance(index)
    return BigInt(balance.baseCoin.votingPower)
}
