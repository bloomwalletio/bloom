import {
    BlockscoutExplorerEndpoint,
    EtherscanExplorerEndpoint,
    ExplorerEndpoint,
    StardustExplorerEndpoint,
} from '../enums'
import { ExplorerType } from '@auxiliary/explorer'

const STARDUST_EXPLORER_ENDPOINTS: Readonly<{ [key in ExplorerEndpoint]?: string }> = {
    [ExplorerEndpoint.Transaction]: StardustExplorerEndpoint.Transaction,
    [ExplorerEndpoint.Output]: StardustExplorerEndpoint.Output,
    [ExplorerEndpoint.Nft]: StardustExplorerEndpoint.Nft,
    [ExplorerEndpoint.Foundry]: StardustExplorerEndpoint.Foundry,
    [ExplorerEndpoint.Address]: StardustExplorerEndpoint.Address,
}

const BLOCKSCOUT_EXPLORER_ENDPOINTS: Readonly<{ [key in ExplorerEndpoint]?: string }> = {
    [ExplorerEndpoint.Transaction]: BlockscoutExplorerEndpoint.Transaction,
    [ExplorerEndpoint.Token]: BlockscoutExplorerEndpoint.Token,
    [ExplorerEndpoint.Address]: BlockscoutExplorerEndpoint.Address,
}

const ETHERSCAN_EXPLORER_ENDPOINTS: Readonly<{ [key in ExplorerEndpoint]?: string }> = {
    [ExplorerEndpoint.Transaction]: EtherscanExplorerEndpoint.Transaction,
    [ExplorerEndpoint.Token]: EtherscanExplorerEndpoint.Token,
    [ExplorerEndpoint.Address]: EtherscanExplorerEndpoint.Address,
}

export function getExplorerEndpoint(
    explorerType: ExplorerType | undefined,
    explorerEndpoint: ExplorerEndpoint
): string | undefined {
    switch (explorerType) {
        case ExplorerType.Stardust:
            return STARDUST_EXPLORER_ENDPOINTS[explorerEndpoint]
        case ExplorerType.Blockscout:
            return BLOCKSCOUT_EXPLORER_ENDPOINTS[explorerEndpoint]
        case ExplorerType.Etherscan:
            return ETHERSCAN_EXPLORER_ENDPOINTS[explorerEndpoint]
        default:
            return undefined
    }
}
