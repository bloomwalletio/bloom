import { DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS, buildUrl } from '@core/utils'
import {} from '../enums'
import { DEFAULT_EXPLORER_API_BASE_URL } from '../constants/default-explorer-api-base-url.constant'
import { ExplorerApiEndpoint } from '../enums'
import { IExplorerApiNetwork, IExplorerApiNetworks } from '../interfaces'
import { NetworkId } from '../types'
import { SupportedStardustNetworkId } from '../constants'

const ExplorerNetworkId = {
    [SupportedStardustNetworkId.Iota]: 'mainnet',
    [SupportedStardustNetworkId.Shimmer]: 'shimmer',
    [SupportedStardustNetworkId.IotaTestnet]: 'iota-testnet',
    [SupportedStardustNetworkId.Testnet]: 'shimmer-testnet',
}

export class ExplorerApi {
    static async makeRequest<T>(endpoint: ExplorerApiEndpoint): Promise<T> {
        try {
            const requestUrl = buildUrl({
                base: DEFAULT_EXPLORER_API_BASE_URL,
                pathname: endpoint,
            })

            if (!requestUrl) {
                throw new Error('Invalid request URL')
            }

            const response = await fetch(requestUrl.href, DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS)
            const data = await response.json()
            return <T>data
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    static async getNetworkInfo(networkId: NetworkId): Promise<IExplorerApiNetwork | undefined> {
        const networksInfo = await ExplorerApi.makeRequest<IExplorerApiNetworks>(ExplorerApiEndpoint.Networks)
        const networkInfo = networksInfo?.networks.find((network) => network.network === ExplorerNetworkId[networkId])
        return networkInfo
    }

    static async getCirculatingSupply(networkId: NetworkId): Promise<number> {
        return (await ExplorerApi.getNetworkInfo(networkId))?.circulatingSupply ?? 0
    }
}
