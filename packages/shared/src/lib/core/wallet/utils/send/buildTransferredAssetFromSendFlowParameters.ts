import { AssetType } from '@core/layer-2/enums'
import { TransferredAsset } from '@core/layer-2/types'
import { IToken } from '@core/token/interfaces'

import { SendFlowParameters } from '../../types'

export function buildTransferredAssetFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters
): TransferredAsset | undefined {
    const { baseCoinTransfer, tokenTransfer } = sendFlowParameters
    if (baseCoinTransfer) {
        return {
            type: AssetType.BaseCoin,
            token: baseCoinTransfer.token ,
            amount: baseCoinTransfer.rawAmount ,
        }
    } else if (tokenTransfer) {
        return {
            type: AssetType.Token,
            token: tokenTransfer.token as IToken,
            amount: tokenTransfer.rawAmount as string,
        }
    } else {
        return undefined
    }
}
