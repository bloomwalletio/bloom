import { MarketCurrency } from '@core/market/enums/market-currency.enum'

export interface ITransakWindowData {
    currency: MarketCurrency
    address: string
    service: 'BUY' | 'SELL'
    amount: number
}
