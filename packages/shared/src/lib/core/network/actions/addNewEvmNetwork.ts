import { addPersistedEvmNetworkToActiveProfile } from '@core/profile/stores'
import { IPureEvmNetworkConfiguration } from '../interfaces/evm-network-configuration.interface'
import { addEvmNetworkToNetworks } from '../stores/networks.store'

// Circular import issue with EvmNetwork class
// Moving it to the bottom fixes the issue...
import { EvmNetwork } from '../classes/evm-network.class'

export function addNewEvmNetwork(evmNetworkConfiguration: IPureEvmNetworkConfiguration): void {
    addPersistedEvmNetworkToActiveProfile(evmNetworkConfiguration)
    addEvmNetworkToNetworks(new EvmNetwork(evmNetworkConfiguration))
}
