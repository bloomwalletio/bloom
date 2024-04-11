import { DEFAULT_EVM_NETWORK_CONFIGURATIONS } from '../constants'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getNameFromNetworkId(networkId: NetworkId): string | undefined {
    const networkName = getNetwork(networkId)?.name
    if (networkName) {
        return networkName
    }

    return Object.values(DEFAULT_EVM_NETWORK_CONFIGURATIONS).find((config) => config?.id === networkId)?.name
}
