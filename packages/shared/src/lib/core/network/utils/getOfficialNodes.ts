import { OFFICIAL_NODE_URLS } from '../constants'
import { INode } from '../interfaces'
import { NetworkIdType } from '../types'

/**
 * Constructs a list of the official IOTA nodes for a given network.
 */
export function getOfficialNodes(networkId: NetworkIdType): INode[] {
    return getOfficialNodeUrls(networkId).map((url) => buildOfficialNode(url))
}

function getOfficialNodeUrls(networkId: NetworkIdType): string[] {
    return OFFICIAL_NODE_URLS?.[networkId] ?? []
}

function buildOfficialNode(url: string): INode {
    return {
        url,
        disabled: false,
    }
}
