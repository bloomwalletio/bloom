import { SendFlowType } from '../stores'
import { SendFlowParameters } from '../types'

export function getChainIdFromSendFlowParameters(params: SendFlowParameters): number | undefined {
    if (params.type === SendFlowType.NftTransfer) {
        return params.nft?.chainId
    } else if (params.type === SendFlowType.TokenTransfer) {
        return params.tokenTransfer?.token?.chainId
    } else {
        return params.baseCoinTransfer?.token?.chainId
    }
}
