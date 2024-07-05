import { FiatCurrency } from '@core/market'

export interface ITransakApiFiatCurrenciesResponse {
    response: ITransakApiFiatCurrenciesResponseItem[]
}

export interface ITransakApiFiatCurrenciesResponseItem {
    symbol: keyof typeof FiatCurrency
    supportingCountries: string[]
    logoSymbol: string
    name: string
    paymentOptions: ITransakApiPaymentOption[]
    isPopular: boolean
    isAllowed: boolean
    roundOff: number
    isPayOutAllowed: boolean
    defaultCountryForNFT?: string
    icon: string
    displayMessage?: string
}

export interface ITransakApiPaymentOption {
    name: string
    id: string
    isNftAllowed?: boolean
    isNonCustodial?: boolean
    processingTime: string
    displayText: boolean
    icon: string
    limitCurrency: string
    isActive: boolean
    provider?: string
    maxAmount: number
    minAmount: number
    defaultAmount: number
    isConverted: boolean
    visaPayoutCountries?: string[]
    mastercardPayoutCountries?: string[]
    isPayOutAllowed?: boolean
    minAmountForPayOut?: number
    maxAmountForPayOut?: number
    defaultAmountForPayOut?: number
    isBillingAddressRequired?: boolean
    supportedCountryCode?: string[]
    displayMessage?: string
}
