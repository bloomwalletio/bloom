import { MarketPrices } from '@core/market/types'
import { ITokenBalance } from './token-balance.interface'
import { IPersistedToken } from './persisted-token.interface'
import { NetworkId } from '@core/network/types'

export interface IToken extends IPersistedToken {
    networkId: NetworkId
    balance: ITokenBalance
    marketPrices?: MarketPrices
}
