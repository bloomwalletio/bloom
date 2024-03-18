import { IAccountState } from '@core/account/interfaces'

import { setAccountActivities } from '../stores'

import { preprocessTransactionsForAccount } from './preprocessTransactionsForAccount'
import { preprocessOutputsForAccount } from './preprocessOutputsForAccount'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { generateActivitiesFromProcessedTransactions } from '../utils/stardust/generateActivitiesFromProcessedTransactions'
import { loadAssetsForAllActivities } from './loadAssetsForAllAccounts'
import { generateActivitiesFromBalanceChanges, generateActivitiesFromEvmChains } from '../utils'
import { NetworkId } from '@core/network'
import { setOutgoingAsyncActivitiesToClaimed } from './setOutgoingAsyncActivitiesToClaimed'

export async function generateAndStoreActivitiesForAccount(
    profileId: string,
    account: IAccountState,
    networkId: NetworkId
): Promise<void> {
    // Step 1: process account transactions and outputs into processed transactions
    const processedTransactions = [
        ...(await preprocessTransactionsForAccount(account)),
        ...(await preprocessOutputsForAccount(account)),
    ]

    // Step 2: link transactions with corresponding claiming transactions
    const linkedProcessedTransactions = linkTransactionsWithClaimingTransactions(
        processedTransactions,
        account,
        profileId
    )

    // Step 3: generate activities from processed transactions
    const activities = await generateActivitiesFromProcessedTransactions(
        linkedProcessedTransactions,
        account,
        networkId
    )
    const balanceChangeActivities = await generateActivitiesFromBalanceChanges(account)
    activities.push(...balanceChangeActivities)

    const chainActivities = await generateActivitiesFromEvmChains(profileId, account)
    activities.push(...chainActivities)

    // Step 4: set account activities with generated activities
    setAccountActivities(account.index, activities)

    hideActivitiesForFoundries(account)
    await setOutgoingAsyncActivitiesToClaimed(account)
    await loadAssetsForAllActivities(account)
}
