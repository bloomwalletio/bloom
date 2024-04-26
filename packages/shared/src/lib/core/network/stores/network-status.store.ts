import { derived } from 'svelte/store'
import { getNetworkStatusFromNodeInfo } from '../helpers'
import { nodeInfo } from './node-info.store'

export const networkStatus = derived([nodeInfo], ([$nodeInfo]) => {
    return getNetworkStatusFromNodeInfo($nodeInfo)
})
