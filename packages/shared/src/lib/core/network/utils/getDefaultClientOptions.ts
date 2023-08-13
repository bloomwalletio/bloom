import { IClientOptions } from '../interfaces'
import { NetworkId } from '../types'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(networkId: NetworkId): IClientOptions {
    const nodes = getOfficialNodes(networkId)
    return { nodes }
}
