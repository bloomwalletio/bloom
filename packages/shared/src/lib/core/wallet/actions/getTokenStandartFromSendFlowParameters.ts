import { SendFlowType } from '../stores'
import { SendFlowParameters } from '../types'

export function getAssetStandard(params: SendFlowParameters): string | undefined {
    if (params.type === SendFlowType.NftTransfer) {
        return params.nft?.parsedMetadata?.standard
    } else if (params.type === SendFlowType.TokenTransfer) {
        return params.tokenTransfer?.asset?.standard
    } else {
        return params.baseCoinTransfer?.asset?.standard
    }
}
