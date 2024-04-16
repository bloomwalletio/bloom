import {
    DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK,
    DEFAULT_STARDUST_NETWORK_METADATA,
} from '../constants'
import { StardustNetworkId } from '../types'
import { IPersistedNetwork } from '../interfaces'

export function getDefaultPersistedNetwork(networkId: StardustNetworkId): IPersistedNetwork {
    const network = structuredClone(DEFAULT_STARDUST_NETWORK_METADATA?.[networkId])
    const chainConfigurations = structuredClone(
        DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK?.[networkId] ?? []
    )
    if (network) {
        return {
            ...network,
            /**
             * CAUTION: If this function is called on existing profiles,
             * it is possible that that profile's chains will be overwritten
             * with this statement.
             */
            chainConfigurations,
        }
    } else {
        throw new Error(`Unable to find network: ${networkId}`)
    }
}
