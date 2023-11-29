import { getActiveNetworkId } from '.'
import { getNetwork } from '../stores'
import { NetworkId } from '../types'

export function getNameFromNetworkId(networkId: NetworkId): string | undefined {
    return networkId === getActiveNetworkId()
        ? getNetwork()?.getMetadata().name
        : getNetwork()?.getChain(networkId)?.getConfiguration().name
}
