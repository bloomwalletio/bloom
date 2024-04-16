import { localize } from '@core/i18n'
import {
    DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK,
    DEFAULT_COIN_TYPE,
    DEFAULT_STARDUST_NETWORK_METADATA,
    TEST_COIN_TYPE,
} from '../constants'
import { TokenStandard } from '@core/token/enums'
import { INodeInfoResponse, IPersistedStardustNetwork } from '../interfaces'
import { NetworkNamespace } from '../enums'
import { StardustNetworkId } from '../types'

// TODO: Rename to reflect return type
export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IPersistedStardustNetwork {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol.networkName
    const id: StardustNetworkId = `${NetworkNamespace.Stardust}:${networkName}`
    const namespace = NetworkNamespace.Stardust
    const name = DEFAULT_STARDUST_NETWORK_METADATA[id]?.name ?? networkName ?? localize('general.unknown')
    const _coinType = coinType ?? DEFAULT_COIN_TYPE[id] ?? TEST_COIN_TYPE

    const chainConfigurations = DEFAULT_ISC_NETWORK_CONFIGURATIONS_PER_STARDUST_NETWORK?.[id] ?? []
    return {
        id,
        name,
        namespace,
        networkName,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chainConfigurations: chainConfigurations,
    }
}
