import { addPersistedEvmNetworkToActiveProfile } from '@core/profile/stores'
import { IPureEvmNetworkConfiguration } from '../interfaces/evm-network-configuration.interface'
import { addEvmNetworkToNetworks } from '../stores/networks.store'
import { loadNftsForNetwork } from '@core/nfts/actions'

// Circular import issue with EvmNetwork class
// Moving it to the bottom fixes the issue...
import { EvmNetwork } from '../classes/evm-network.class'

export function addNewEvmNetwork(evmNetworkConfiguration: IPureEvmNetworkConfiguration): void {
    addPersistedEvmNetworkToActiveProfile(evmNetworkConfiguration)
    const network = new EvmNetwork(evmNetworkConfiguration)
    addEvmNetworkToNetworks(network)

    void loadNftsForNetwork(network)
}
