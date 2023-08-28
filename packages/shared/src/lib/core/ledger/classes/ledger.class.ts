import { buildBip32PathFromBip44 } from '@core/account/utils/buildBip32PathFromBip44'
import { Platform } from '@core/app/classes'
import { IPlatformEventMap } from '@core/app/interfaces'
import { localize } from '@core/i18n'
import { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import {
    calculateMaxGasFeeFromTransactionData,
    getAmountFromEvmTransactionValue,
    prepareEvmTransaction,
} from '@core/layer-2/utils'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { TxData } from '@ethereumjs/tx'
import type { Bip44 } from '@iota/wallet/types'
import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { DEFAULT_LEDGER_API_REQUEST_OPTIONS } from '../constants'
import { LedgerApiMethod, LedgerAppName } from '../enums'
import { ILedgerApiBridge, ILedgerEthereumAppSettings } from '../interfaces'
import { LedgerApiRequestResponse } from '../types'
import { isBlindSigningRequiredForEvmTransaction } from '@core/ledger'
import { EvmChainId } from '@core/network'

declare global {
    interface Window {
        __LEDGER__: ILedgerApiBridge
    }
}

const ledgerApiBridge: ILedgerApiBridge = window['__LEDGER__']

export class Ledger {
    static async getEthereumAppSettings(): Promise<ILedgerEthereumAppSettings> {
        /* eslint-disable no-return-await */
        return await this.callLedgerApiAsync<ILedgerEthereumAppSettings>(
            () => ledgerApiBridge.makeRequest(LedgerApiMethod.GetEthereumAppSettings),
            'ethereum-app-settings'
        )
    }

    static async isBlindSigningEnabledForEvm(): Promise<boolean> {
        return Boolean((await this.getEthereumAppSettings())?.arbitraryDataEnabled)
    }

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
        transactionData: TxData,
        chainId: EvmChainId,
        bip44: Bip44
    ): Promise<string | unknown> {
        /* eslint-disable no-async-promise-executor */
        /* eslint-disable @typescript-eslint/no-misused-promises */
        return new Promise(async (resolve) => {
            // TEST CODE
            if (!transactionData.data) {
                transactionData.data = '0x01'
            }
            // TEST CODE

            const unsignedTransactionMessageHex = prepareEvmTransaction(transactionData, chainId)
            const bip32Path = buildBip32PathFromBip44(bip44)
            const maxGasFee = calculateMaxGasFeeFromTransactionData(transactionData)

            const mustEnableBlindSigning =
                isBlindSigningRequiredForEvmTransaction(transactionData) && !(await this.isBlindSigningEnabledForEvm())
            if (mustEnableBlindSigning) {
                openPopup({
                    id: PopupId.EnableLedgerBlindSigning,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        appName: LedgerAppName.Ethereum,
                        onEnabled: async () => {
                            resolve(await this.signEvmTransaction(transactionData, chainId, bip44))
                        },
                    },
                })
            } else {
                openPopup({
                    id: PopupId.VerifyLedgerTransaction,
                    hideClose: true,
                    preventClose: true,
                    props: {
                        isEvmTransaction: true,
                        toAmount: getAmountFromEvmTransactionValue(transactionData?.value?.toString()),
                        toAddress: transactionData.to,
                        chainId,
                        maxGasFee,
                    },
                })

                const transactionSignature = await this.callLedgerApiAsync<IEvmTransactionSignature>(
                    () =>
                        ledgerApiBridge.makeRequest(
                            LedgerApiMethod.SignEvmTransaction,
                            unsignedTransactionMessageHex,
                            bip32Path
                        ),
                    'evm-signed-transaction'
                )

                openPopup(
                    {
                        id: PopupId.SendFlow,
                    },
                    true
                )

                const { r, v, s } = transactionSignature
                if (r && v && s) {
                    resolve(prepareEvmTransaction(transactionData, chainId, { r, v, s }))
                } else {
                    resolve()
                }
            }
        })
    }

    private static async callLedgerApiAsync<R extends LedgerApiRequestResponse>(
        callback: () => void,
        responseEvent: keyof IPlatformEventMap
    ): Promise<R> {
        // TODO: Do we need to stop / start polling here? Get's slightly complicated in that
        // the Ethereum app settings polling uses this function.

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
