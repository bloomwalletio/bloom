import { FiatCurrency } from '@core/market/enums'

export interface ITransakWindowData {
    currency: keyof typeof FiatCurrency
    address: string
    service: 'BUY' | 'SELL'
    amount: number
    paymentMethod: string
}
