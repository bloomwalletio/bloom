import { get } from 'svelte/store'

import { formatTokenAmountDefault, sendFlowParameters, SendFlowType } from '@core/wallet'
import { PopupProps } from '../../../../../../desktop/lib/auxiliary/popup/types'

export function deconstructLedgerVerificationProps(): PopupProps | undefined {
    const transactionData = get(sendFlowParameters)

    if (!transactionData) {
        return
    }

    const { type, recipient } = transactionData

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress = recipient?.type === 'account' ? recipient?.account?.depositAddress : recipient?.address
    let toAmount = '0'
    if (type === SendFlowType.BaseCoinTransfer) {
        const { rawAmount, asset, unit } = transactionData.baseCoinTransfer || {}
        toAmount = asset?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), asset.metadata, unit)
            : String(rawAmount)
    } else if (type === SendFlowType.TokenTransfer) {
        const { rawAmount, asset, unit } = transactionData.tokenTransfer || {}
        toAmount = asset?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), asset.metadata, unit)
            : String(rawAmount)
    }

    return {
        toAddress,
        toAmount,
    }
}
