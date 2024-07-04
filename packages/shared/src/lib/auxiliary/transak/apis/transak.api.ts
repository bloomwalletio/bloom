import { BaseApi } from '@core/utils'
import { TRANSAK_API_BASE_URL } from '../constants'
import { ITransakApiCryptoCurrenciesResponse, ITransakApiFiatCurrenciesResponse } from '../interfaces'
import { TransakApiEndpoint } from '../enums'

export class TransakApi extends BaseApi {
    constructor() {
        super(TRANSAK_API_BASE_URL)
    }

    async getFiatCurrencies(): Promise<ITransakApiFiatCurrenciesResponse | undefined> {
        const response = await this.get<ITransakApiFiatCurrenciesResponse>(TransakApiEndpoint.FiatCurrencies)
        return response
    }

    async getCryptoCurrencies(): Promise<ITransakApiCryptoCurrenciesResponse | undefined> {
        const response = await this.get<ITransakApiCryptoCurrenciesResponse>(TransakApiEndpoint.CryptoCurrencies)
        return response
    }
}
