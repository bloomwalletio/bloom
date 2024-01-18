// oldBalance & newBalance are strings, because they are persisted in svelte stores.
// JSON.stringify() is called on persisted values. BigInt types are not suited for this.
export interface ITokenBalanceChange {
    changedAt: number
    oldBalance?: string
    newBalance: string
    hidden?: boolean
}
