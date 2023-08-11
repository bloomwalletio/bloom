import { NetworkIdType } from '../types'

export interface ITrackedTokens {
    [networkId: NetworkIdType]: string[] | undefined
}
