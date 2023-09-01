import { SendFlowType } from '../stores'
import { SendFlowParameters } from '../types'

export function getTokenIdFromSendFlowParameters(params: SendFlowParameters): string | undefined {
    if (params.type === SendFlowType.NftTransfer) {
        return params.nft?.id
    } else if (params.type === SendFlowType.TokenTransfer) {
        return params.tokenTransfer?.token?.id
    } else {
        return params.baseCoinTransfer?.token?.id
    }
}
