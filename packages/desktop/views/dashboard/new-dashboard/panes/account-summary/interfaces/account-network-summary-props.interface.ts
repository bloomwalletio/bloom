import { NetworkHealth, NetworkId } from '@core/network'
import { IAccountTokensPerNetwork } from '@core/token'

export interface IAccountNetworkSummaryProps {
    networkId: NetworkId
    networkName: string
    networkHealth: NetworkHealth
    networkAddress: string
    networkTokenBalance: string
    networkFiatBalance: string
    networkTokens: IAccountTokensPerNetwork
}
