import { getNetwork } from '../stores'

export function getAllNetworkIds(): string[] {
    const network = getNetwork()
    if (!network) {
        return []
    }

    // const networkIds = [network.getMetadata().id, 'eip155:1', 'eip155:5']
    const networkIds = [network.id]
    for (const chain of network.getChains()) {
        networkIds.push(chain.id)
    }
    return networkIds
}
