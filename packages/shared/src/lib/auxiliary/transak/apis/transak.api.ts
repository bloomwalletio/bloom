import { BaseApi } from '@core/utils'
import {
    ITransakApiCryptoCurrenciesResponse,
    ITransakApiCryptoCurrenciesResponseItem,
    ITransakApiFiatCurrenciesResponse,
    ITransakApiPriceParams,
    ITransakApiPriceResponse,
} from '../interfaces'
import { TransakApiEndpoint } from '../enums'

export class TransakApi extends BaseApi {
    constructor(url: string) {
        super(url)
    }

    async getFiatCurrencies(): Promise<ITransakApiFiatCurrenciesResponse | undefined> {
        const response = await this.get<ITransakApiFiatCurrenciesResponse>(TransakApiEndpoint.FiatCurrencies)
        return response
    }

    async getCryptoCurrencies(): Promise<ITransakApiCryptoCurrenciesResponseItem[] | undefined> {
        const response = await this.get<ITransakApiCryptoCurrenciesResponse>(TransakApiEndpoint.CryptoCurrencies)
        return response?.response
    }

    async getFilteredCryptoCurrencies(
        allowedNetworkNames: string[],
        allowedNetworkChainIds: string[]
    ): Promise<ITransakApiCryptoCurrenciesResponseItem[] | undefined> {
        const response = await this.getCryptoCurrencies()
        const filteredResponse = response?.filter((cryptoCurrency) => {
            if (cryptoCurrency.isAllowed && !cryptoCurrency.isSuspended) {
                return (
                    allowedNetworkNames.some((networkName) => networkName === cryptoCurrency.network.name) ||
                    allowedNetworkChainIds.some((chainId) => chainId === cryptoCurrency.network.chainId)
                )
            } else {
                return false
            }
        })
        return filteredResponse
    }

    async getPrices(params: ITransakApiPriceParams): Promise<ITransakApiPriceResponse | undefined> {
        const partnerApiKey = process.env.TRANSAK_API_KEY ?? ''
        const { fiatCurrency, cryptoCurrency, isBuyOrSell, networkName, paymentMethod, fiatAmount } = params
        const response = await this.get<ITransakApiPriceResponse>(TransakApiEndpoint.Price, {
            partnerApiKey,
            fiatCurrency,
            cryptoCurrency,
            isBuyOrSell,
            networkName,
            paymentMethod,
            fiatAmount,
        })
        return response
    }
}
