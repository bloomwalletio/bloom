import { localize } from '@core/i18n'
import { TokenStandard } from '@core/wallet/enums'
import { COIN_TYPE, DEFAULT_TANGLE_NETWORK_METADATA, TEST_COIN_TYPE } from '../constants'
import { INodeInfoResponse, IPersistedNetwork } from '../interfaces'
import { getNetworkWithIdFromNetworkName } from './getNetworkWithIdFromNetworkName'

export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IPersistedNetwork {
    const networkWithId = getNetworkWithIdFromNetworkName(nodeInfoResponse?.nodeInfo?.protocol.networkName)
    const name = DEFAULT_TANGLE_NETWORK_METADATA[networkWithId.id]?.name ?? localize('general.unknown')
    const _coinType = coinType ?? COIN_TYPE[networkWithId.id] ?? TEST_COIN_TYPE
    return {
        ...networkWithId,
        name,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chainConfigurations: [],
    }
}
