import { buildBip32Path } from '@core/account/utils'
import { Platform } from '@core/app/classes'
import { IPlatformEventMap } from '@core/app/interfaces'
import { localize } from '@core/i18n'
import { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import { EvmTransactionData } from '@core/layer-2/types'
import { prepareEvmTransaction } from '@core/layer-2/utils'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

import { DEFAULT_LEDGER_API_REQUEST_OPTIONS } from '../constants'
import { LedgerApiMethod } from '../enums'
import { ILedgerApiBridge, ILedgerApiRequestOptions } from '../interfaces'
import { LedgerApiRequestResponse } from '../types'

declare global {
    interface Window {
        __LEDGER__: ILedgerApiBridge
    }
}

const ledgerApiBridge: ILedgerApiBridge = window['__LEDGER__']

export class Ledger {
    private readonly _apiRequestOptions: ILedgerApiRequestOptions

    constructor(apiRequestOptions?: ILedgerApiRequestOptions) {
        this._apiRequestOptions = apiRequestOptions ?? DEFAULT_LEDGER_API_REQUEST_OPTIONS
    }

    static async generateEvmAddress(accountIndex: number, coinType: number, verify?: boolean): Promise<string> {
        const bip32Path = buildBip32Path(coinType, accountIndex)
        const response = await this.callLedgerApiAsync<IEvmAddress>(
            () => ledgerApiBridge.makeRequest(LedgerApiMethod.GenerateEvmAddress, bip32Path, verify ?? false),
            'evm-address'
        )
        return response.evmAddress
    }

    static async signEvmTransaction(transactionData: EvmTransactionData, bip32Path: string): Promise<string> {
        const unsignedTransactionMessageHex = prepareEvmTransaction(transactionData)
        const transactionSignature = await this.callLedgerApiAsync<IEvmTransactionSignature>(
            () =>
                ledgerApiBridge.makeRequest(
                    LedgerApiMethod.SignEvmTransaction,
                    unsignedTransactionMessageHex,
                    bip32Path
                ),
            'evm-signed-transaction'
        )
        const { r, v, s } = transactionSignature
        if (r && v && s) {
            return prepareEvmTransaction(transactionData, { r, v, s })
        }
    }

    private static async callLedgerApiAsync<R extends LedgerApiRequestResponse>(
        callback: () => void,
        responseEvent: keyof IPlatformEventMap
    ): Promise<R> {
        const { timeout, pollingInterval } = this._apiRequestOptions
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
