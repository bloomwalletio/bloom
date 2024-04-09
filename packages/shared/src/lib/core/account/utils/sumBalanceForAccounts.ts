import { IAccountState } from '@core/account'

export function sumBalanceForAccounts(accounts: IAccountState[]): bigint {
    return accounts.reduce(
        (total: bigint, account: IAccountState) => (total += account.balances.baseCoin.total),
        BigInt(0)
    )
}
