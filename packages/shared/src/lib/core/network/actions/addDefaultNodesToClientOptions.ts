import { get } from 'svelte/store'
import { updateClientOptions } from '@core/network/actions'
import { getDefaultNodes } from '@core/network/utils'
import { activeProfile } from '@core/profile/stores'

export function addDefaultNodesToClientOptions(): void {
    const { clientOptions, network } = get(activeProfile)
    const currentNodes = clientOptions?.nodes ?? []
    const officialNodes = getDefaultNodes(network.id)
    const newOfficialNodes = officialNodes.filter(
        (officialNode) => !currentNodes.some((currentNode) => currentNode.url === officialNode.url)
    )
    const nodes = [...currentNodes, ...newOfficialNodes]
    void updateClientOptions({ nodes })
}
