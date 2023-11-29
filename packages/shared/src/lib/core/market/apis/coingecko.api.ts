import { DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS } from '@core/utils'
import { MARKET_API_BASE_URL } from '../constants'
import { CoinGeckoApiEndpoint, CoinGeckoNetworkId, MarketCoinId, MarketCurrency } from '../enums'
import { MarketCoinPrices } from '../types'
import { CoinGeckoCoin } from '../interfaces'

export class CoinGeckoApi {
    static async makeRequest<T>(endpoint: string, queryParams?: string): Promise<T> {
        try {
            const response = await fetch(
                `${MARKET_API_BASE_URL}${endpoint}?${queryParams ?? ''}`,
                DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS
            )
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
        const queryParams = buildQueryParametersFromObject({
            ids: ids.join(','),
            vs_currencies: vsCurrencies.join(','),
        })
        return this.makeRequest<MarketCoinPrices>(CoinGeckoApiEndpoint.SIMPLE_PRICE, queryParams)
    }

    static async getCoinsList(include_platform: boolean): Promise<CoinGeckoCoin[]> {
        const queryParams = buildQueryParametersFromObject({
            include_platform,
        })
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

function buildQueryParametersFromObject(obj: Record<string, string | number | boolean>): string {
    return Object.keys(obj)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&')
}
