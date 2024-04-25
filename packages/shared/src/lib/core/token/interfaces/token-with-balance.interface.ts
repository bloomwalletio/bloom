import { MarketPrices } from '@core/market/types'
import { IExtendedTokenBalance } from './extended-token-balance.interface'
import { IToken } from './token.interface'

export interface ITokenWithBalance extends IToken {
    balance: IExtendedTokenBalance
    marketPrices?: MarketPrices
}
