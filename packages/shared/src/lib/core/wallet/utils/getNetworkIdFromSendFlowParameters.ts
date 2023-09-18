import { NetworkId } from '@core/network/types'
import { SendFlowType } from '../enums'
import { SendFlowParameters } from '../types'

export function getNetworkIdFromSendFlowParameters(params: SendFlowParameters): NetworkId | undefined {
    if (params.type === SendFlowType.NftTransfer) {
        return params.nft?.networkId
    } else if (params.type === SendFlowType.TokenTransfer) {
        return params.tokenTransfer?.token?.networkId
    } else {
        return params.baseCoinTransfer?.token?.networkId
    }
}
