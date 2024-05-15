import { DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS } from '@core/utils/constants'
import { buildUrl } from '@core/utils/url'
import { SupportedNetworkId } from '../constants'
import { DEFAULT_EXPLORER_API_BASE_URL } from '../constants/default-explorer-api-base-url.constant'
import { ExplorerApiEndpoint } from '../enums'
import { IExplorerApiNetwork, IExplorerApiNetworks } from '../interfaces'
import type { NetworkId } from '../types'

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
        const ExplorerNetworkId = {
            [SupportedNetworkId.Iota]: 'mainnet',
            [SupportedNetworkId.Shimmer]: 'shimmer',
            [SupportedNetworkId.IotaTestnet]: 'iota-testnet',
            [SupportedNetworkId.Testnet]: 'shimmer-testnet',
        }
        const networksInfo = await ExplorerApi.makeRequest<IExplorerApiNetworks>(ExplorerApiEndpoint.Networks)
        const networkInfo = networksInfo?.networks.find((network) => network.network === ExplorerNetworkId[networkId])
        return networkInfo
    }

    static async getCirculatingSupply(networkId: NetworkId): Promise<number> {
        return (await ExplorerApi.getNetworkInfo(networkId))?.circulatingSupply ?? 0
    }
}
