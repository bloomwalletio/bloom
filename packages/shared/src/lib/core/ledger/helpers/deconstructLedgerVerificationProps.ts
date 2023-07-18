import { get } from 'svelte/store'

import { formatTokenAmountDefault, newTransactionData, NewTransactionType } from '@core/wallet'
import { PopupProps } from '../../../../../../desktop/lib/auxiliary/popup/types'

export function deconstructLedgerVerificationProps(): PopupProps | undefined {
    const transactionData = get(newTransactionData)

    if (!transactionData) {
        return
    }

    const { type, recipient } = transactionData

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress = recipient?.type === 'account' ? recipient?.account?.depositAddress : recipient?.address
    let toAmount = '0'
    if (type === NewTransactionType.TokenTransfer) {
        const { rawAssetAmount, asset, unit } = transactionData
        toAmount = `${
            asset?.metadata ? formatTokenAmountDefault(Number(rawAssetAmount), asset.metadata, unit) : rawAssetAmount
        }`
    }

    return {
        toAddress,
        toAmount,
    }
}
