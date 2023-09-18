import { IAccountState } from '@core/account/interfaces'

import { NetworkId } from '@core/network'
import { setAccountActivitiesInAllAccountActivities } from '../stores'

import { generateActivitiesFromBalanceChanges, generateActivitiesFromChains } from '../utils'
import { generateActivitiesFromProcessedTransactions } from '../utils/generateActivitiesFromProcessedTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { loadAssetsForAllActivities } from './loadAssetsForAllAccounts'
import { preprocessOutputsForAccount } from './preprocessOutputsForAccount'
import { preprocessTransactionsForAccount } from './preprocessTransactionsForAccount'
import { setOutgoingAsyncActivitiesToClaimed } from './setOutgoingAsyncActivitiesToClaimed'

export async function generateAndStoreActivitiesForAccount(
    account: IAccountState,
    networkId: NetworkId
): Promise<void> {
    // Step 1: process account transactions and outputs into processed transactions
    const processedTransactions = [
        ...(await preprocessTransactionsForAccount(account)),
        ...(await preprocessOutputsForAccount(account)),
    ]

    // Step 2: link transactions with corresponding claiming transactions
    const linkedProcessedTransactions = linkTransactionsWithClaimingTransactions(processedTransactions, account)

    // Step 3: generate activities from processed transactions
    const activities = await generateActivitiesFromProcessedTransactions(
        linkedProcessedTransactions,
        account,
        networkId
    )
    const balanceChangeActivities = await generateActivitiesFromBalanceChanges(account)
    activities.push(...balanceChangeActivities)

    const chainActivities = await generateActivitiesFromChains(account)
    activities.push(...chainActivities)

    // Step 4: set account activities with generated activities
    setAccountActivitiesInAllAccountActivities(account.index, activities)

    hideActivitiesForFoundries(account)
    await setOutgoingAsyncActivitiesToClaimed(account)
    await loadAssetsForAllActivities(account)
}
