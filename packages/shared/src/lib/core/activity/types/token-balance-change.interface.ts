export interface ITokenBalanceChange {
    changedAt: number
    oldBalance?: bigint
    newBalance: bigint
    hidden?: boolean
}
