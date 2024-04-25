import { DEFAULT_ISC_CHAINS_CONFIGURATIONS } from '../constants'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getNameFromNetworkId(networkId: NetworkId): string | undefined {
    const networkName = getNetwork(networkId)?.name
    if (networkName) {
        return networkName
    }

    return Object.values(DEFAULT_ISC_CHAINS_CONFIGURATIONS).find((config) => config?.id === networkId)?.name
}
