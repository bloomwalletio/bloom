import { getActiveNetworkId } from '.'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '../constants'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getNameFromNetworkId(networkId: NetworkId): string | undefined {
    if (networkId === getActiveNetworkId()) {
        return getNetwork()?.getMetadata().name
    } else {
        const networkName = getNetwork()?.getChain(networkId)?.name
        if (networkName) {
            return networkName
        }

        return Object.values(DEFAULT_CHAIN_CONFIGURATIONS).find((config) => config.id === networkId)?.name
    }
}
