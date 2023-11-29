import { getNetwork } from '../stores'
import { ChainConfiguration, NetworkId } from '../types'

export function getChainConfiguration(networkId: NetworkId): ChainConfiguration | undefined {
    return getNetwork()?.getChain(networkId)?.getConfiguration()
}
