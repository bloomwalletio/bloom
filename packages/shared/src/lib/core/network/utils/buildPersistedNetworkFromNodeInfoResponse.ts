import { localize } from '@core/i18n'
import { COIN_TYPE, DEFAULT_NETWORK_METADATA, TEST_COIN_TYPE } from '../constants'
import { TokenStandard } from '@core/token/enums'
import { INodeInfoResponse, IPersistedNetwork } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IPersistedNetwork {
    const id = getNetworkIdFromNetworkName(nodeInfoResponse?.nodeInfo?.protocol.networkName)
    const name = DEFAULT_NETWORK_METADATA[id]?.name ?? localize('general.unknown')
    const _coinType = coinType ?? COIN_TYPE[id] ?? TEST_COIN_TYPE
    return {
        id,
        name,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chainConfigurations: [],
    }
}
