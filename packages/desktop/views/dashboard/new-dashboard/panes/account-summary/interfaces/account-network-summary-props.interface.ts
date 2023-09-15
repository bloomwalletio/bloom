import { NetworkHealth, NetworkId } from '@core/network'

export interface IAccountNetworkSummaryProps {
    networkId: NetworkId
    networkName: string
    networkHealth: NetworkHealth
    networkAddress: string
    networkTokenBalance: string
    networkFiatBalance: string
}
