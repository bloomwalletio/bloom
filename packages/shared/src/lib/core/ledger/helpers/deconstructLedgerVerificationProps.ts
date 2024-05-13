import { formatTokenAmount } from '@core/token'
import { sendFlowParameters } from '@core/wallet/stores'
import { SendFlowType } from '@core/wallet/enums'
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
    const { rawAmount, token } =
        (type === SendFlowType.BaseCoinTransfer
            ? _sendFlowParameters.baseCoinTransfer
            : _sendFlowParameters.tokenTransfer) ?? {}
    const toAmount = token?.metadata
        ? formatTokenAmount(rawAmount ?? BigInt(0), token.metadata, { withUnit: true, round: false })
        : String(rawAmount)

    return {
        toAddress,
        toAmount,
    }
}
