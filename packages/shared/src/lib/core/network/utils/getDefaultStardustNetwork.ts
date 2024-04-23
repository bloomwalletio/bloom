import { DEFAULT_ISC_CHAINS_CONFIGURATIONS, DEFAULT_NETWORK_METADATA } from '../constants'
import { StardustNetworkId } from '../types'
import { IStardustNetworkMetadata } from '../interfaces'

export function getDefaultStardustNetwork(networkId: StardustNetworkId): IStardustNetworkMetadata {
    const network = structuredClone(DEFAULT_NETWORK_METADATA?.[networkId])
    const configuration = structuredClone(DEFAULT_ISC_CHAINS_CONFIGURATIONS?.[networkId])
    const chainConfigurations = configuration ? [configuration] : []
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
