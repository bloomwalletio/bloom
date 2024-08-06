import { activeAccounts, addPersistedEvmNetworkToActiveProfile, getActiveProfileId } from '@core/profile/stores'
import { IPureEvmNetworkConfiguration } from '../interfaces/evm-network-configuration.interface'
import { addEvmNetworkToNetworks } from '../stores/networks.store'
import { loadNftsForNetwork } from '@core/nfts/actions'
import { loadTokensForEvmNetwork } from '@core/token/actions'
import { addPersistedToken } from '@core/token/stores'
import { addAccountActivities, generateEvmActivitiesFromEvmChain, loadAssetsForAllActivities } from '@core/activity'
import { get } from 'svelte/store'

// Circular import issue with EvmNetwork class
// Moving it to the bottom fixes the issue...
import { EvmNetwork } from '../classes/evm-network.class'
import { fetchAndPersistTransactionsForNetwork } from '@core/transactions/actions'

export async function addNewEvmNetwork(evmNetworkConfiguration: IPureEvmNetworkConfiguration): Promise<void> {
    const profileId = getActiveProfileId()
    const accounts = get(activeAccounts)

    addPersistedEvmNetworkToActiveProfile(evmNetworkConfiguration)
    const network = new EvmNetwork(evmNetworkConfiguration)
    addEvmNetworkToNetworks(network)

    const tokens = await loadTokensForEvmNetwork(network, true)
    addPersistedToken(network.id, ...tokens)

    for (const account of accounts) {
        await loadNftsForNetwork(account, network)

        const activities = await generateEvmActivitiesFromEvmChain(profileId, network, account)
        addAccountActivities(account.index, activities)
        await loadAssetsForAllActivities(account)
    }

    await fetchAndPersistTransactionsForNetwork(network, profileId, accounts)
}
