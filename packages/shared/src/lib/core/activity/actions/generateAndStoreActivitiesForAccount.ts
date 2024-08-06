import { IAccountState } from '@core/account/interfaces'

import { setAccountActivities } from '../stores'

import { preprocessTransactionsForAccount } from './preprocessTransactionsForAccount'
import { preprocessOutputsForAccount } from './preprocessOutputsForAccount'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { generateActivitiesFromProcessedTransactions } from '../utils/stardust/generateActivitiesFromProcessedTransactions'
import { loadAssetsForAllActivities } from './loadAssetsForAllAccounts'
import { generateActivitiesFromBalanceChanges, generateEvmActivitiesFromEvmChain } from '../utils'
import { getEvmNetworks, StardustNetworkId } from '@core/network'
import { setOutgoingAsyncActivitiesToClaimed } from './setOutgoingAsyncActivitiesToClaimed'
import { Activity } from '../types'

export async function generateAndStoreActivitiesForAccount(
    profileId: string,
    account: IAccountState,
    networkId: StardustNetworkId
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
    const activities: Activity[] = await generateActivitiesFromProcessedTransactions(
        linkedProcessedTransactions,
        account,
        networkId
    )
    const balanceChangeActivities = await generateActivitiesFromBalanceChanges(profileId, account)
    activities.push(...balanceChangeActivities)

    for (const evmNetwork of getEvmNetworks()) {
        const chainActivities = await generateEvmActivitiesFromEvmChain(profileId, evmNetwork, account)
        activities.push(...chainActivities)
    }

    // Step 4: set account activities with generated activities
    setAccountActivities(account.index, activities)

    hideActivitiesForFoundries(account)
    await setOutgoingAsyncActivitiesToClaimed(account)
    await loadAssetsForAllActivities(account)
}
