import { DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS, QueryParameters, buildUrl } from '@core/utils'
import { MARKET_API_BASE_URL } from '../constants'
import { CoinGeckoApiEndpoint, CoinGeckoNetworkId, MarketCoinId, MarketCurrency } from '../enums'
import { MarketCoinPrices } from '../types'
import { CoinGeckoCoin } from '../interfaces'
import { localize } from '@core/i18n'

export class CoinGeckoApi {
    static async makeRequest<T>(endpoint: string, query?: QueryParameters): Promise<T> {
        try {
            const url = buildUrl({
                base: MARKET_API_BASE_URL,
                pathname: `api/v3/${endpoint}`,
                query,
            })

            if (!url) {
                throw localize('error.global.invalidUrl')
            }

            const response = await fetch(url.href, DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS)
            const data = await response.json()
            return <T>data
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    static async getSimplePrices(
        ids: (MarketCoinId | string)[],
        vsCurrencies: MarketCurrency[]
    ): Promise<MarketCoinPrices> {
        const queryParams = { ids, vs_currencies: vsCurrencies }
        return this.makeRequest<MarketCoinPrices>(CoinGeckoApiEndpoint.SIMPLE_PRICE, queryParams)
    }

    static async getCoinsList(include_platform: boolean): Promise<CoinGeckoCoin[]> {
        const queryParams = { include_platform }
        return this.makeRequest<CoinGeckoCoin[]>(CoinGeckoApiEndpoint.COINS_LIST, queryParams)
    }

    static async getFilteredCoinsList(networkId: CoinGeckoNetworkId): Promise<CoinGeckoCoin[]> {
        const coinsList = await this.getCoinsList(true)
        return coinsList.filter((coin) => Object.keys(coin.platforms).includes(networkId))
    }

    static async getCoinDetails(id: string): Promise<CoinGeckoCoin> {
        return this.makeRequest<CoinGeckoCoin>(`${CoinGeckoApiEndpoint.COIN_DETAILS}/${id}`)
    }
}
