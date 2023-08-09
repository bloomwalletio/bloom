import { MarketPrices } from '@core/market'
import { ITokenBalance } from './token-balance.interface'
import { IPersistedToken } from './persisted-token.interface'

export interface IToken extends IPersistedToken {
    chainId: number
    balance: ITokenBalance
    marketPrices?: MarketPrices
}
