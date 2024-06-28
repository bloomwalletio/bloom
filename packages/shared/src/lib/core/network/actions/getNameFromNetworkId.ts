import {
    DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK,
    DEFAULT_ISC_CHAINS_CONFIGURATIONS,
} from '../constants'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getNameFromNetworkId(networkId: NetworkId): string | undefined {
    const knownNetworkName = getNetwork(networkId)?.name
    if (knownNetworkName) {
        return knownNetworkName
    }

    const potentialIscChainName = Object.values(DEFAULT_ISC_CHAINS_CONFIGURATIONS).find(
        (config) => config?.id === networkId
    )?.name

    if (potentialIscChainName) {
        return potentialIscChainName
    }

    const potentialEvmChainName = Object.values(DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK)
        .flat()
        .find((config) => config?.id === networkId)?.name

    return potentialEvmChainName
}
