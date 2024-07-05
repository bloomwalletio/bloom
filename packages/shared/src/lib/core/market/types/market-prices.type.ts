import { MarketCurrency } from './market-currency.type'

export type MarketPrices = { [key in MarketCurrency]?: number }
