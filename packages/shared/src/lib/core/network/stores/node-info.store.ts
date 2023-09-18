import { writable } from 'svelte/store'
import type { INodeInfo } from '@iota/sdk'

export const nodeInfo = writable<INodeInfo | undefined>(undefined)

export function setNodeInfo(newNodeInfo: INodeInfo | undefined): void {
    return nodeInfo.set(newNodeInfo)
}
