import { get } from 'svelte/store'

import { formatTokenAmountDefault, newTransactionData, NewTransactionType } from '@core/wallet'
import { PopupProps } from '../../../../../../desktop/lib/auxiliary/popup/types'

export function deconstructLedgerVerificationProps(): PopupProps {
    const transactionData = get(newTransactionData)

    // TODO: Add ledger support for NFTs

    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const toAddress =
        transactionData?.recipient?.type === 'account'
            ? transactionData?.recipient?.account?.depositAddress
            : transactionData?.recipient?.address
    let toAmount = '0'
    if (transactionData?.type === NewTransactionType.TokenTransfer) {
        toAmount = `${formatTokenAmountDefault(
            Number(transactionData?.rawAmount),
            transactionData?.asset?.metadata,
            transactionData?.unit
        )}`
    }

    return {
        toAddress,
        toAmount,
    }
}
