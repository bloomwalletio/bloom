/**
 * The utility process for ledger runs in a Node.js environment,
 * meaning it has the ability to require modules and use all of Node.js APIs.
 * This approach doesn't block the main process when interacting with the ledger device.
 *
 * https://www.electronjs.org/docs/latest/tutorial/process-model#the-utility-process
 */

import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import AppEth from '@ledgerhq/hw-app-eth'
import { listen } from '@ledgerhq/logs'

import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Transaction } from '@ethereumjs/tx'
import { bufArrToArr } from '@ethereumjs/util'

let transport

// TODO: Remove in https://github.com/iotaledger/firefly/issues/6960
const TX_OPTIONS = {
    common: Common.custom({
        chainId: 1071,
    }),
}

process.parentPort.on('message', void messageHandler)

export interface ILedgerProcessMessage {
    error?: string | Error | unknown
    data: ILedgerProcessMessageData
}

export interface ILedgerProcessMessageData {
    method: LedgerMethod
    parameters: string[]
}

export enum LedgerMethod {
    GenerateEvmAddress = 'generate-evm-address',
    SignEvmTransaction = ' sign-evm-transaction',
}

async function messageHandler(message: ILedgerProcessMessage): Promise<void> {
    try {
        await openTransport()

        let data
        switch (message.data.method) {
            case LedgerMethod.GenerateEvmAddress: {
                data = await getEvmAddress(...message.data.parameters)
                break
            }
            case LedgerMethod.SignEvmTransaction: {
                data = await signTransactionData(...message.data.parameters)
                break
            }
            default:
                break
        }

        await closeTransport()

        process.parentPort.postMessage({ data: { ...data, method: message.data.method } })
    } catch (error) {
        process.parentPort.postMessage({ error })
    }
}

async function openTransport(): Promise<void> {
    if (!transport) {
        transport = await TransportNodeHid.open('')
        listen((log) => {
            process.parentPort.postMessage({ data: log })
        })
    }
}

async function closeTransport(): Promise<void> {
    if (transport) {
        await transport.close()
        transport = undefined
    }
}

async function getEvmAddress(bip32Path: string): Promise<{ evmAddress: string; bip32Path: string }> {
    const appEth = new AppEth(transport)
    const data = await appEth.getAddress(bip32Path)

    return { evmAddress: data.address, bip32Path }
}

async function signTransactionData(data: object, bip32Path: string): Promise<{ signedTransaction: string }> {
    const appEth = new AppEth(transport)

    const transactionData = Transaction.fromTxData(data, TX_OPTIONS)
    const unsignedTransaction = transactionData.getMessageToSign(false)
    const serializedUnsignedTransaction = Buffer.from(RLP.encode(bufArrToArr(unsignedTransaction)))

    try {
        const signature = await appEth.signTransaction(bip32Path, serializedUnsignedTransaction, null)
        const signedTransactionObject = Transaction.fromTxData(
            {
                ...data,
                v: '0x' + signature.v,
                r: '0x' + signature.r,
                s: '0x' + signature.s,
            },
            TX_OPTIONS
        )

        const serializedSignedTransaction = Buffer.from(RLP.encode(bufArrToArr(signedTransactionObject.raw())))
        const serializedSignedTransactionString = '0x' + serializedSignedTransaction.toString('hex')

        return { signedTransaction: serializedSignedTransactionString }
    } catch (error) {
        return { signedTransaction: undefined }
    }
}
