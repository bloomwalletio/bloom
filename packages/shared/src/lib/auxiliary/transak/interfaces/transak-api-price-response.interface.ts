interface ITransakApiPriceResponseFeeBreakdown {
    name: string
    value: number
    id: string
    ids: string[]
}

interface ITransakApiPriceResponseContent {
    quoteId: string
    conversionPrice: number
    marketConversionPrice: number
    slippage: number
    fiatCurrency: string
    cryptoCurrency: string
    paymentMethod: string
    fiatAmount: number
    cryptoAmount: number
    isBuyOrSell: 'BUY' | 'SELL'
    network: string
    feeDecimal: number
    totalFee: number
    feeBreakdown: ITransakApiPriceResponseFeeBreakdown[]
    nonce: number
    cryptoLiquidityProvider: string
    notes: string[]
}

export interface ITransakApiPriceResponse {
    response: ITransakApiPriceResponseContent
}
