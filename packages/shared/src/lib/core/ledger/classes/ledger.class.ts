import { ILedger } from '../interfaces'
import { IEvmAddress, IPlatformEventMap, Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { localize } from '@core/i18n'
import { EvmTransactionData, IEvmTransactionSignature, prepareEvmTransaction } from '@core/layer-2'
import { buildBip32Path } from '@core/account'
import { LedgerMethod } from 'desktop/lib/electron/enums/ledger-method.enum'
import { ILedgerApiBridge } from 'desktop/lib/electron/apis/ledger.api'

declare global {
    interface Window {
        __LEDGER__: ILedger
    }
}

export const LedgerApiBridge: ILedgerApiBridge = window['__LEDGER__']

export class Ledger implements ILedger {
    private readonly _apiRequestOptions: ILedgerApiRequestOptions

    constructor(apiRequestOptions?: ILedgerApiRequestOptions) {
        this._apiRequestOptions = apiRequestOptions ?? DEFAULT_LEDGER_API_REQUEST_CONFIGURATION
    }

    async generateEvmAddress(accountIndex: number, coinType: number, verify?: boolean): Promise<string> {
        const bip32Path = buildBip32Path(coinType, accountIndex)
        const response = await this.callLedgerApiAsync<IEvmAddress>(
            () => LedgerApiBridge.makeRequest(LedgerMethod.GenerateEvmAddress, bip32Path, verify ?? false),
            'evm-address'
        )
        return response.evmAddress
    }

    async signEvmTransaction(transactionData: EvmTransactionData, bip32Path: string): Promise<string> {
        const unsignedTransactionMessageHex = prepareEvmTransaction(transactionData)
        const transactionSignature = await this.callLedgerApiAsync<IEvmTransactionSignature>(
            () => LedgerApiBridge.makeRequest(LedgerMethod.SignEvmTransaction, unsignedTransactionMessageHex, bip32Path),
            'evm-signed-transaction'
        )
        const { r, v, s } = transactionSignature
        if (r && v && s) {
            return prepareEvmTransaction(transactionData, { r, v, s })
        }
    }

    private async callLedgerApiAsync<R extends LedgerApiRequestResponse>(callback: () => void, responseEvent: keyof IPlatformEventMap): Promise<R> {
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
                if (returnValue && (Object.keys(returnValue).length !== 0)) {
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

export interface ILedgerApiRequestOptions {
    timeout: number
    pollingInterval: number
}

export const DEFAULT_LEDGER_API_REQUEST_CONFIGURATION: ILedgerApiRequestOptions = {
    timeout: 60,
    pollingInterval: 100,
}

export type LedgerApiRequestResponse = IEvmAddress | IEvmTransactionSignature
