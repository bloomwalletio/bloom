import type { NetworkHealth, NetworkId } from '@core/network'
import type { INft } from '@core/nfts'
import type { IAccountTokensPerNetwork } from '@core/token'

export interface IAccountNetworkSummaryProps {
    networkId: NetworkId
    name: string
    health: NetworkHealth
    address: string
    tokenBalance: string
    fiatBalance: string
    tokens: IAccountTokensPerNetwork
    nfts: INft[]
}
