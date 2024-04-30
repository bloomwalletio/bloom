import { NetworkId } from '@core/network/types'
import { IPersistedToken } from './persisted-token.interface'

export interface IPersistedTokens {
    [profileId: string]: {
        [networkId: NetworkId]: {
            [tokenId: string]: IPersistedToken
        }
    }
}
