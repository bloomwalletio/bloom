import { MarketCurrency } from '@core/market/types'

export interface ITransakWindowData {
    currency: MarketCurrency
    address: string
    service: 'BUY' | 'SELL'
    amount: number
}
