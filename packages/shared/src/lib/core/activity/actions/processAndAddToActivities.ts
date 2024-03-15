import type { Transaction } from '@iota/sdk/out/types'

import type { IAccountState } from '@core/account/interfaces'
import { addAccountActivities } from '../stores'
import { preprocessTransaction } from '../utils/outputs'
import { generateActivitiesFromStardustNetwork } from '../utils/stardust/generateActivitiesFromStardustNetwork'
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
    const activities = await generateActivitiesFromStardustNetwork(preprocessedTransaction, account, networkId)
    addAccountActivities(account.index, activities)
}
