import { INode } from '@iota/sdk/out/types'
import { DEFAULT_NODE_URLS } from '../constants'
import { StardustNetworkId } from '../types'

/**
 * Constructs a list of the official IOTA nodes for a given network.
 */
export function getDefaultNodes(networkId: StardustNetworkId): INode[] {
    return getDefaultNodeUrls(networkId).map((url) => buildOfficialNode(url))
}

function getDefaultNodeUrls(networkId: StardustNetworkId): string[] {
    return DEFAULT_NODE_URLS?.[networkId] ?? []
}

function buildOfficialNode(url: string): INode {
    return {
        url,
        disabled: false,
    }
}
