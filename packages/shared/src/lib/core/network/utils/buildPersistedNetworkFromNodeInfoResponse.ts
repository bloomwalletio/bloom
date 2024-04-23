import { localize } from '@core/i18n'
import {
    DEFAULT_ISC_CHAINS_CONFIGURATIONS,
    DEFAULT_COIN_TYPE,
    DEFAULT_NETWORK_METADATA,
    TEST_COIN_TYPE,
} from '../constants'
import { TokenStandard } from '@core/token/enums'
import { INodeInfoResponse, IStardustNetworkMetadata } from '../interfaces'
import { NetworkNamespace } from '../enums'
import { StardustNetworkId } from '../types'

export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IStardustNetworkMetadata {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol.networkName
    const id: StardustNetworkId = `${NetworkNamespace.Stardust}:${networkName}`
    const namespace = NetworkNamespace.Stardust
    const name = DEFAULT_NETWORK_METADATA[id]?.name ?? networkName ?? localize('general.unknown')
    const _coinType = coinType ?? DEFAULT_COIN_TYPE[id] ?? TEST_COIN_TYPE

    const configuration = DEFAULT_ISC_CHAINS_CONFIGURATIONS?.[id]
    const chainConfigurations = configuration ? [configuration] : []
    return {
        id,
        name,
        namespace,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chainConfigurations: chainConfigurations,
    }
}
