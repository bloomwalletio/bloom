import { AssetType } from '@core/layer-2/enums'
import { TransferredAsset } from '@core/layer-2/types'

import { SendFlowParameters, TokenTransferData } from '../../types'

export function buildTransferredAssetFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters
): TransferredAsset | undefined {
    const { baseCoinTransfer, tokenTransfer } = sendFlowParameters
    const isBaseCoinTransfer = Boolean(baseCoinTransfer)
    const transfer: TokenTransferData = isBaseCoinTransfer ? baseCoinTransfer : tokenTransfer
    const { rawAmount, token } = transfer
    if (rawAmount && token) {
        return <TransferredAsset>{
            type: isBaseCoinTransfer ? AssetType.BaseCoin : AssetType.Token,
            amount: rawAmount,
            token,
        }
    } else {
        return undefined
    }
}
