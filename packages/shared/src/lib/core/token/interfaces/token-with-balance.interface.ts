import { MarketPrices } from '@core/market/types'
import { ITokenBalance } from './token-balance.interface'
import { IToken } from './token.interface'

export interface ITokenWithBalance extends IToken {
    balance: ITokenBalance
    marketPrices?: MarketPrices
}
