import { ExplorerEndpoint } from '../enums'
import { NetworkId } from '../types'
import { getExplorerApiNetworkName } from './getExplorerApiNetworkName'
import { isStardustNetwork } from './isStardustNetwork'
import { isEvmNetwork } from './isEvmNetwork'

const STARDUST_EXPLORER_ENDPOINTS: Readonly<{ [key in ExplorerEndpoint]?: string }> = {
    [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
    [ExplorerEndpoint.Output]: ExplorerEndpoint.Output,
    [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
    [ExplorerEndpoint.Foundry]: ExplorerEndpoint.Foundry,
    [ExplorerEndpoint.Address]: 'addr',
}

const EVM_EXPLORER_ENDPOINTS: Readonly<{ [key in ExplorerEndpoint]?: string }> = {
    [ExplorerEndpoint.Transaction]: 'tx',
    [ExplorerEndpoint.Token]: ExplorerEndpoint.Token,
    [ExplorerEndpoint.Address]: ExplorerEndpoint.Address,
}

export function getExplorerEndpoint(networkId: NetworkId, explorerEndpoint: ExplorerEndpoint): string | undefined {
    if (isStardustNetwork(networkId)) {
        return `${getExplorerApiNetworkName(networkId)}/${STARDUST_EXPLORER_ENDPOINTS[explorerEndpoint]}`
    } else if (isEvmNetwork(networkId)) {
        return EVM_EXPLORER_ENDPOINTS[explorerEndpoint]
    }
}
