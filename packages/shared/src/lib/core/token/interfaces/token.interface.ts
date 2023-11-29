import { IPersistedToken } from './persisted-token.interface'
import { NetworkId } from '@core/network/types'

export interface IToken extends IPersistedToken {
    networkId: NetworkId
}
