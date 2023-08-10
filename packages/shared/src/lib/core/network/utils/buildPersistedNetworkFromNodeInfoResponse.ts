import { localize } from '@core/i18n'
import { TokenStandard } from '@core/wallet/enums'
import { COIN_TYPE, DEFAULT_TANGLE_NETWORK_METADATA, TEST_COIN_TYPE } from '../constants'
import { INodeInfoResponse, IPersistedNetwork } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IPersistedNetwork {
    const networkId = getNetworkIdFromNetworkName(nodeInfoResponse?.nodeInfo?.protocol.networkName)
    const name = DEFAULT_TANGLE_NETWORK_METADATA[networkId.protocolId]?.name ?? localize('general.unknown')
    const _coinType = coinType ?? COIN_TYPE[networkId.id] ?? TEST_COIN_TYPE
    return {
        ...networkId,
        name,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chainConfigurations: [],
    }
}
