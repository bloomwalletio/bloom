import { formatTokenAmountDefault, sendFlowParameters, SendFlowType } from '@core/wallet'
import { get } from 'svelte/store'
import { PopupProps } from '../../../../../../desktop/lib/auxiliary/popup/types'

export function deconstructLedgerVerificationProps(): PopupProps | undefined {
    const _sendFlowParameters = get(sendFlowParameters)

    if (!_sendFlowParameters) {
        return
    }

    const { type, recipient } = _sendFlowParameters

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress = recipient?.type === 'account' ? recipient?.account?.depositAddress : recipient?.address
    let toAmount = '0'
    if (type === SendFlowType.BaseCoinTransfer) {
        const { rawAmount, asset, unit } = _sendFlowParameters.baseCoinTransfer || {}
        toAmount = asset?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), asset.metadata, unit)
            : String(rawAmount)
    } else if (type === SendFlowType.TokenTransfer) {
        const { rawAmount, asset, unit } = _sendFlowParameters.tokenTransfer || {}
        toAmount = asset?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), asset.metadata, unit)
            : String(rawAmount)
    }

    return {
        toAddress,
        toAmount,
    }
}
