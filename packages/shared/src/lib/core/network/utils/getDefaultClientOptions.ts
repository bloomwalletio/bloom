import { IClientOptions } from '../interfaces'
import { NetworkIdType } from '../types'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(networkId: NetworkIdType): IClientOptions {
    const nodes = getOfficialNodes(networkId)
    return { nodes }
}
