import { DEFAULT_NODE_URLS } from '../constants'
import { INode } from '../interfaces'
import { NetworkId } from '../types'

/**
 * Constructs a list of the official IOTA nodes for a given network.
 */
export function getDefaultNodes(networkId: NetworkId): INode[] {
    return getDefaultNodeUrls(networkId).map((url) => buildOfficialNode(url))
}

function getDefaultNodeUrls(networkId: NetworkId): string[] {
    return DEFAULT_NODE_URLS?.[networkId] ?? []
}

function buildOfficialNode(url: string): INode {
    return {
        url,
        disabled: false,
    }
}
