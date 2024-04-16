import { DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK } from '../constants'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getNameFromNetworkId(networkId: NetworkId): string | undefined {
    const networkName = getNetwork(networkId)?.name
    if (networkName) {
        return networkName
    }

    return Object.values(DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK).find(
        (config) => config?.id === networkId
    )?.name
}
