import { addPersistedEvmNetworkToActiveProfile, addPersistedIscNetworkToActiveProfile } from '@core/profile/stores'
import { IIscChainConfiguration, IPureEvmNetworkConfiguration } from '../interfaces/evm-network-configuration.interface'
import { addEvmNetworkToNetworks, addIscNetworkToNetworks } from '../stores/networks.store'
import { NetworkType } from '../enums'

export function addNewNetwork(networkConfiguration: IPureEvmNetworkConfiguration | IIscChainConfiguration): void {
    if (networkConfiguration.type === NetworkType.Evm) {
        addPersistedEvmNetworkToActiveProfile(networkConfiguration)
        addEvmNetworkToNetworks(networkConfiguration)
    } else {
        addPersistedIscNetworkToActiveProfile(networkConfiguration)
        addIscNetworkToNetworks(networkConfiguration)
    }
}
