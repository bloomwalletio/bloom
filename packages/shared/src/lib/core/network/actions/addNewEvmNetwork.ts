import { activeAccounts, addPersistedEvmNetworkToActiveProfile, getActiveProfileId } from '@core/profile/stores'
import { IPureEvmNetworkConfiguration } from '../interfaces/evm-network-configuration.interface'
import { addEvmNetworkToNetworks } from '../stores/networks.store'
import { loadNftsForNetwork } from '@core/nfts/actions'
import { loadTokensForEvmNetwork } from '@core/token/actions'
import { addPersistedToken } from '@core/token/stores'

// Circular import issue with EvmNetwork class
// Moving it to the bottom fixes the issue...
import { EvmNetwork } from '../classes/evm-network.class'
import { generateEvmActivitiesFromEvmChain, loadAssetsForAllActivities } from '@core/activity'
import { get } from 'svelte/store'

export async function addNewEvmNetwork(evmNetworkConfiguration: IPureEvmNetworkConfiguration): Promise<void> {
    addPersistedEvmNetworkToActiveProfile(evmNetworkConfiguration)
    const network = new EvmNetwork(evmNetworkConfiguration)
    addEvmNetworkToNetworks(network)

    const tokens = await loadTokensForEvmNetwork(network, true)
    addPersistedToken(network.id, ...tokens)

    const profileId = getActiveProfileId()
    for (const account of get(activeAccounts)) {
        await loadNftsForNetwork(account, network)

        generateEvmActivitiesFromEvmChain(profileId, network, account)
        await loadAssetsForAllActivities(account)
    }
}
