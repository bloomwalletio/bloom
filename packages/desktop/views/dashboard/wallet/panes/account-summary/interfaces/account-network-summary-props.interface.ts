import type { NetworkHealth, NetworkId } from '@core/network'
import type { INft } from '@core/nfts'
import type { IAccountTokensPerNetwork } from '@core/token'

export interface IAccountNetworkSummaryProps {
    networkId: NetworkId
    networkName: string
    networkHealth: NetworkHealth
    networkAddress: string
    networkTokenBalance: string
    networkFiatBalance: string
    networkTokens: IAccountTokensPerNetwork
    networkNfts: INft[]
}
