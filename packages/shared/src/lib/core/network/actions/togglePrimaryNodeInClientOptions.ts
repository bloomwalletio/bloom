import { get } from 'svelte/store'
import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile/stores'

export async function togglePrimaryNodeInClientOptions(node: INode): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    const newPrimaryNode = node.url === clientOptions?.primaryNode?.url ? null : node
    await updateClientOptions({ primaryNode: newPrimaryNode })
}
