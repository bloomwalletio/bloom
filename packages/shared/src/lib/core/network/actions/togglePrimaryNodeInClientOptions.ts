import { INode } from '@iota/sdk/out/types'
import { updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function togglePrimaryNodeInClientOptions(node: INode): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    const newPrimaryNode = node.url === clientOptions?.primaryNode?.url ? undefined : node
    await updateClientOptions({ primaryNode: newPrimaryNode })
}
