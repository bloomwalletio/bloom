import { DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS } from '@core/utils'
import {} from '../enums'
import { DEFAULT_EXPLORER_API_BASE_URL } from '../constants/default-explorer-api-base-url.constant'
import { StardustNetworkId, ExplorerApiEndpoint } from '../enums'
import { IExplorerApiNetworks } from '../interfaces'
import { getExplorerApiNetworkName } from '../utils'

export class ExplorerApi {
    static async makeRequest<T>(endpoint: ExplorerApiEndpoint, queryParams?: string): Promise<T> {
        try {
            const response = await fetch(
                `${DEFAULT_EXPLORER_API_BASE_URL}${endpoint}?${queryParams ?? ''}`,
                DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS
            )
            const data = await response.json()
            return <T>data
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    static async getCirculatingSupply(networkId: StardustNetworkId): Promise<number> {
        const networkName = getExplorerApiNetworkName(networkId)
        const networksInfo = await this.makeRequest<IExplorerApiNetworks>(ExplorerApiEndpoint.Networks, networkId)
        const networkInfo = networksInfo?.networks.find((network) => network.network === networkName)
        return networkInfo?.circulatingSupply ?? 0
    }
}
