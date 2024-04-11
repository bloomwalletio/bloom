import { EvmNetworkConfiguration, NetworkMetadata } from '../types'

export interface IPersistedNetwork extends NetworkMetadata {
    chainConfigurations: EvmNetworkConfiguration[]
}
