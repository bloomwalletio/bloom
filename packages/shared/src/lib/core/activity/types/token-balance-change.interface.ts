export interface ITokenBalanceChange {
    changedAt: number
    oldBalance?: number
    newBalance: number
    hidden?: boolean
}
