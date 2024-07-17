import { FiatCurrency } from '@core/market/enums'

export interface ITransakApiPriceParams {
    fiatCurrency: keyof typeof FiatCurrency
    cryptoCurrency: string
    isBuyOrSell: 'BUY' | 'SELL'
    networkName: string
    paymentMethod: string
    fiatAmount: number
}
