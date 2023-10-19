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
import type { Bip44 } from '@iota/sdk/out/types'
import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { DEFAULT_LEDGER_API_REQUEST_OPTIONS } from '../constants'
import { LedgerApiMethod, LedgerAppName } from '../enums'
import { ILedgerApiBridge } from '../interfaces'
import { LedgerApiRequestResponse } from '../types'
import {
    ILedgerApiRequestOptions,
    ILedgerEthereumAppSettings,
    isBlindSigningRequiredForEvmTransaction,
} from '@core/ledger'
import { EvmChainId } from '@core/network/enums'
import { toRpcSig } from '@ethereumjs/util'
import { Converter } from '@core/utils'


declare global {
    interface Window {
        __LEDGER__: ILedgerApiBridge
    }
}

const ledgerApiBridge: ILedgerApiBridge = window['__LEDGER__']

export class Ledger {
    static async getEthereumAppSettings(): Promise<ILedgerEthereumAppSettings | undefined> {
        try {
            return await this.callLedgerApiAsync<ILedgerEthereumAppSettings>(
                () => ledgerApiBridge.makeRequest(LedgerApiMethod.GetEthereumAppSettings),
                'ethereum-app-settings',
                {
                    timeout: 0.5 * MILLISECONDS_PER_SECOND,
                }
            )
        } catch (err) {
            return undefined
        }
    }

    static async isBlindSigningEnabledForEvm(): Promise<boolean> {
        return Boolean((await this.getEthereumAppSettings())?.blindSigningEnabled)
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
    ): Promise<string | void> {
        /* eslint-disable no-async-promise-executor */
        /* eslint-disable @typescript-eslint/no-misused-promises */
        return new Promise<string | void>(async (resolve, reject) => {
            const unsignedTransactionMessageHex = prepareEvmTransaction(transactionData, chainId)
            const bip32Path = buildBip32PathFromBip44(bip44)
            const maxGasFee = calculateMaxGasFeeFromTransactionData(transactionData)

            const mustEnableBlindSigning =
                isBlindSigningRequiredForEvmTransaction(transactionData) && !(await this.isBlindSigningEnabledForEvm())
            if (mustEnableBlindSigning) {
                let canResolve = true
                openPopup({
                    id: PopupId.EnableLedgerBlindSigning,
                    props: {
                        appName: LedgerAppName.Ethereum,
                        onEnabled: async () => {
                            canResolve = false
                            try {
                                resolve(await this.signEvmTransaction(transactionData, chainId, bip44))
                            } catch (err) {
                                reject(err)
                            }
                        },
                        onClose: () => {
                            if (canResolve) {
                                canResolve = false
                                resolve()
                            }
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
                    reject(localize('error.send.cancelled'))
                }
            }
        })
    }

    static async signMessage(
        rawMessage: string,
        bip44: Bip44
    ): Promise<string | undefined> {
        /* eslint-disable no-async-promise-executor */
        /* eslint-disable @typescript-eslint/no-misused-promises */
        return new Promise<string | undefined>(async (resolve, reject) => {
            const bip32Path = buildBip32PathFromBip44(bip44)

            // const mustEnableBlindSigning =
            //     isBlindSigningRequiredForEvmTransaction(transactionData) && !(await this.isBlindSigningEnabledForEvm())
            // if (mustEnableBlindSigning) {
            //     let canResolve = true
            //     openPopup({
            //         id: PopupId.EnableLedgerBlindSigning,
            //         props: {
            //             appName: LedgerAppName.Ethereum,
            //             onEnabled: async () => {
            //                 canResolve = false
            //                 try {
            //                     resolve(await this.signEvmTransaction(transactionData, chainId, bip44))
            //                 } catch (err) {
            //                     reject(err)
            //                 }
            //             },
            //             onClose: () => {
            //                 if (canResolve) {
            //                     canResolve = false
            //                     resolve()
            //                 }
            //             },
            //         },
            //     })
            // } else {
        //    openPopup({
        //         id: PopupId.VerifyLedgerTransaction,
        //         hideClose: true,
        //         preventClose: true,
        //         props: {
        //             isEvmTransaction: true,
        //             hash: rawMessage,
        //         }
        //     })

            const messageHex = Converter.utf8ToHex(rawMessage)
            console.log('messageHex', messageHex)
            const transactionSignature = await this.callLedgerApiAsync<IEvmTransactionSignature>(
                () =>
                    ledgerApiBridge.makeRequest(
                        LedgerApiMethod.SignMessage,
                        messageHex,
                        bip32Path
                    ),
                'signed-message'
            )
            console.log('Signature:', transactionSignature)
            const { r, v, s } = transactionSignature
            if (r && v && s) {
                const vBig = BigInt(v)
                const rBuffer = Buffer.from(r, 'utf8');
                const sBuffer = Buffer.from(s, 'utf8');

                resolve(toRpcSig(vBig, rBuffer, sBuffer))
            } else {
                reject(localize('error.send.cancelled'))
            }
        })
    }

    private static async callLedgerApiAsync<R extends LedgerApiRequestResponse>(
        callback: () => void,
        responseEvent: keyof IPlatformEventMap,
        requestOptions: Partial<ILedgerApiRequestOptions> = {}
    ): Promise<R> {
        // TODO: Do we need to stop / start polling here? Get's slightly complicated in that
        // the Ethereum app settings polling uses this function.

        const { timeout, pollingInterval } = { ...DEFAULT_LEDGER_API_REQUEST_OPTIONS, ...requestOptions }
        const iterationCount = timeout / pollingInterval

        callback()

        let isGenerating = true
        let returnValue: R | undefined = undefined

        Platform.onEvent(responseEvent, (value) => {
            isGenerating = false
            returnValue = <R>value
        })

        for (let count = 0; count < iterationCount; count++) {
            if (!isGenerating) {
                Platform.removeListenersForEvent(responseEvent)
                if (returnValue && Object.keys(returnValue).length !== 0) {
                    return returnValue
                } else {
                    return Promise.reject('error.ledger.rejected')
                }
            }
            await sleep(pollingInterval)
        }

        Platform.removeListenersForEvent(responseEvent)
        return Promise.reject(localize('error.ledger.timeout'))
    }
}
