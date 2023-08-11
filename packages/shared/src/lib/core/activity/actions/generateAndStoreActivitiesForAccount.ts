import { IAccountState } from '@core/account/interfaces'

import { setAccountActivitiesInAllAccountActivities } from '../stores'

import { preprocessTransactionsForAccount } from './preprocessTransactionsForAccount'
import { preprocessOutputsForAccount } from './preprocessOutputsForAccount'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { generateActivitiesFromProcessedTransactions } from './generateActivitiesFromProcessedTransactions'
import { loadAssetsForAllActivities } from './loadAssetsForAllAccounts'
import { generateActivitiesFromBalanceChanges, setOutgoingAsyncActivitiesToClaimed } from '@core/activity/actions'
import { NetworkIdType } from '@core/network'

export async function generateAndStoreActivitiesForAccount(
    account: IAccountState,
    network: NetworkIdType
): Promise<void> {
    // Step 1: process account transactions and outputs into processed transactions
    const processedTransactions = [
        ...(await preprocessTransactionsForAccount(account)),
        ...(await preprocessOutputsForAccount(account)),
    ]

    // Step 2: link transactions with corresponding claiming transactions
    const linkedProcessedTransactions = linkTransactionsWithClaimingTransactions(processedTransactions, account)

    // Step 3: generate activities from processed transactions
    const activities = generateActivitiesFromProcessedTransactions(linkedProcessedTransactions, account, network)
    const balanceChangeActivities = generateActivitiesFromBalanceChanges(account)

    activities.push(...balanceChangeActivities)

    // Step 4: set account activities with generated activities
    setAccountActivitiesInAllAccountActivities(account.index, activities)

    hideActivitiesForFoundries(account)
    await setOutgoingAsyncActivitiesToClaimed(account)
    await loadAssetsForAllActivities(account)
}
