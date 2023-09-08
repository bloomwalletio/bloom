import { buildBip32PathFromBip44 } from '@core/account/utils/buildBip32PathFromBip44'
import { Platform } from '@core/app/classes'
import { IPlatformEventMap } from '@core/app/interfaces'
import { localize } from '@core/i18n'
import { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import { EvmTransactionData } from '@core/layer-2/types'
import {
    calculateMaxGasFeeFromTransactionData,
    getAmountFromEvmTransactionValue,
    prepareEvmTransaction,
} from '@core/layer-2/utils'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { TxData } from '@ethereumjs/tx'
import type { Bip44 } from '@iota/sdk/out/types'
import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { DEFAULT_LEDGER_API_REQUEST_OPTIONS } from '../constants'
import { LedgerApiMethod } from '../enums'
import { ILedgerApiBridge } from '../interfaces'
import { LedgerApiRequestResponse } from '../types'
import { EvmChainId } from '@core/network/enums'

declare global {
    interface Window {
        __LEDGER__: ILedgerApiBridge
    }
}

const ledgerApiBridge: ILedgerApiBridge = window['__LEDGER__']

export class Ledger {
    static async generateEvmAddress(accountIndex: number, coinType: number, verify?: boolean): Promise<string> {
        const bip32Path = buildBip32PathFromBip44({
            coinType,
            account: accountIndex,
        })
        const response = await this.callLedgerApiAsync<IEvmAddress>(
            () => ledgerApiBridge.makeRequest(LedgerApiMethod.GenerateEvmAddress, bip32Path, verify ?? false),
            'evm-address'
        )
        return response.evmAddress
    }

    static async signEvmTransaction(
        txData: TxData,
        chainId: EvmChainId,
        bip44: Bip44,
        promptVerification = true
    ): Promise<string | undefined> {
        const unsignedTransactionMessageHex = prepareEvmTransaction(txData as EvmTransactionData, chainId)
        const bip32Path = buildBip32PathFromBip44(bip44)

        const maxGasFee = calculateMaxGasFeeFromTransactionData(txData)
        // TODO: https://github.com/bloomwalletio/bloom/issues/432
        if (promptVerification) {
            openPopup({
                id: PopupId.VerifyLedgerTransaction,
                hideClose: true,
                preventClose: true,
                props: {
                    isEvmTransaction: true,
                    toAmount: getAmountFromEvmTransactionValue(txData?.value?.toString()).toString(),
                    toAddress: txData.to,
                    chainId,
                    maxGasFee,
                },
            })
        }

        const transactionSignature = await this.callLedgerApiAsync<IEvmTransactionSignature>(
            () =>
                ledgerApiBridge.makeRequest(
                    LedgerApiMethod.SignEvmTransaction,
                    unsignedTransactionMessageHex,
                    bip32Path
                ),
            'evm-signed-transaction'
        )

        if (promptVerification) {
            openPopup(
                {
                    id: PopupId.SendFlow,
                },
                true
            )
        }

        const { r, v, s } = transactionSignature
        if (r && v && s) {
            return prepareEvmTransaction(txData, chainId, { r, v, s })
        }
    }

    private static async callLedgerApiAsync<R extends LedgerApiRequestResponse>(
        callback: () => void,
        responseEvent: keyof IPlatformEventMap
    ): Promise<R> {
        const { timeout, pollingInterval } = DEFAULT_LEDGER_API_REQUEST_OPTIONS
        const iterationCount = (timeout * MILLISECONDS_PER_SECOND) / pollingInterval

        callback()

        let isGenerating = true
        let returnValue: R | undefined = undefined

        Platform.onEvent(responseEvent, (value) => {
            isGenerating = false
            returnValue = <R>value
        })

        for (let count = 0; count < iterationCount; count++) {
            if (!isGenerating) {
                if (returnValue && Object.keys(returnValue).length !== 0) {
                    return returnValue
                } else {
                    return Promise.reject('error.ledger.rejected')
                }
            }
            await sleep(pollingInterval)
        }

        return Promise.reject(localize('error.ledger.timeout'))
    }
}
