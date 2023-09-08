import type { Transaction } from '@iota/sdk/out/types'

import type { IAccountState } from '@core/account/interfaces'
import { addActivitiesToAccountActivitiesInAllAccountActivities } from '../stores'
import { preprocessTransaction } from './outputs'
import { generateActivities } from './generateActivities'
import { NetworkId } from '@core/network/types'

// We pass the account as a parameter,
// because logging out while transaction is pending,
// clears the the selectedAccount store at this point.
export async function processAndAddToActivities(
    transaction: Transaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<void> {
    const preprocessedTransaction = await preprocessTransaction(transaction, account)
    const activities = await generateActivities(preprocessedTransaction, account, networkId)
    addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
}
