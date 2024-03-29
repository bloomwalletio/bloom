import { INode } from '@iota/sdk/out/types'
import { updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function removeNodeFromClientOptions(node: INode): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    if (clientOptions?.nodes?.length && clientOptions?.nodes?.length > 1) {
        const remainingNodes = clientOptions?.nodes?.filter((n) => n.url !== node.url)
        const primaryNode = clientOptions?.primaryNode?.url === node.url ? undefined : clientOptions?.primaryNode
        await updateClientOptions({ nodes: remainingNodes, primaryNode })
    } else {
        return Promise.reject('Cannot remove last node')
    }
}
