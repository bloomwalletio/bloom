import { CryptoCurrency, FiatCurrency } from '../enums'

export type MarketPrices = { [key in FiatCurrency | CryptoCurrency]?: number }
