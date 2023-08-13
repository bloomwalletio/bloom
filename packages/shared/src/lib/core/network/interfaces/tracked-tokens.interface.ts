import { NetworkId } from '../types'

export interface ITrackedTokens {
    [networkId: NetworkId]: string[] | undefined
}
