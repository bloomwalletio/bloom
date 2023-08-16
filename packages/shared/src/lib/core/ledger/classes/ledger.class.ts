import { buildBip32PathFromBip44 } from '@core/account/utils/buildBip32PathFromBip44'
import { Platform } from '@core/app/classes'
import { IPlatformEventMap } from '@core/app/interfaces'
import { localize } from '@core/i18n'
import { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import { EvmTransactionData } from '@core/layer-2/types'
import { getAmountFromEvmTransactionValue, prepareEvmTransaction } from '@core/layer-2/utils'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

import { DEFAULT_LEDGER_API_REQUEST_OPTIONS } from '../constants'
import { LedgerApiMethod } from '../enums'
import { ILedgerApiBridge } from '../interfaces'
import { LedgerApiRequestResponse } from '../types'
import type { Bip44 } from '@iota/wallet/types'
import { closePopup, openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { getProtocolIdFromNetworkId, NetworkId } from '@core/network'

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
        transactionData: EvmTransactionData,
        networkId: NetworkId,
        bip44: Bip44,
        promptVerification = true
    ): Promise<string | undefined> {
        const unsignedTransactionMessageHex = prepareEvmTransaction(transactionData)
        const bip32Path = buildBip32PathFromBip44(bip44)
        const chainId = Number(getProtocolIdFromNetworkId(networkId))

        // TODO: https://github.com/bloomwalletio/bloom/issues/432
        if (promptVerification) {
            openPopup({
                id: PopupId.VerifyLedgerTransaction,
                hideClose: true,
                preventClose: true,
                props: {
                    isEvmTransaction: true,
                    toAmount: getAmountFromEvmTransactionValue(transactionData.value.toString()),
                    toAddress: transactionData.to,
                    chainId,
                    maxFees: BigInt(transactionData.gasLimit.toString()).toString(10),
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
            closePopup(true)
        }

        const { r, v, s } = transactionSignature
        if (r && v && s) {
            return prepareEvmTransaction(transactionData, { r, v, s })
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
