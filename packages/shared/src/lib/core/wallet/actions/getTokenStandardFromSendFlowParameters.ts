import { SendFlowType } from '../stores'
import { SendFlowParameters } from '../types'

export function getTokenStandardFromSendFlowParameters(params: SendFlowParameters): string | undefined {
    if (params.type === SendFlowType.NftTransfer) {
        return params.nft?.parsedMetadata?.standard
    } else if (params.type === SendFlowType.TokenTransfer) {
        return params.tokenTransfer?.token?.standard
    } else {
        return params.baseCoinTransfer?.token?.standard
    }
}
