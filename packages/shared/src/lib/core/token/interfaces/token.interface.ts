import { NetworkId } from '@core/network/types'
import { IPersistedToken } from './persisted-token.interface'

export interface IToken extends IPersistedToken {
    networkId: NetworkId
}
