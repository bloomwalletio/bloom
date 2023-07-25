import { Balance, SyncOptions } from '@iota/sdk'

import { IAccount } from '../interfaces'

export async function syncAccountsInParallel(syncOptions: SyncOptions, ...accounts: IAccount[]): Promise<Balance[]> {
    return Promise.all(accounts.map((account) => account?.sync(syncOptions)))
}
