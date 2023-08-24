import { formatTokenAmountDefault } from '@core/token'
import { SendFlowType, sendFlowParameters } from '@core/wallet/stores'
import { get } from 'svelte/store'
import { PopupProps } from '../../../../../../desktop/lib/auxiliary/popup/types'

export function deconstructLedgerVerificationProps(): PopupProps | undefined {
    const _sendFlowParameters = get(sendFlowParameters)

    if (!_sendFlowParameters) {
        return
    }

    const { type, recipient } = _sendFlowParameters

    // TODO: Add ledger support for NFTs
    if (type === SendFlowType.NftTransfer) {
        return
    }

    const toAddress = recipient?.type === 'account' ? recipient?.account?.depositAddress : recipient?.address
    const { rawAmount, token, unit } =
        (type === SendFlowType.BaseCoinTransfer
            ? _sendFlowParameters.baseCoinTransfer
            : _sendFlowParameters.tokenTransfer) ?? {}
    const toAmount = token?.metadata
        ? formatTokenAmountDefault(Number(rawAmount), token.metadata, unit)
        : String(rawAmount)

    return {
        toAddress,
        toAmount,
    }
}
