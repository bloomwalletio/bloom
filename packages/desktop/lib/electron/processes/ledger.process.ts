/**
 * The utility process for ledger runs in a Node.js environment,
 * meaning it has the ability to require modules and use all of Node.js APIs.
 * This approach doesn't block the main process when interacting with the ledger device.
 *
 * https://www.electronjs.org/docs/latest/tutorial/process-model#the-utility-process
 */

import { closeTransport, getEvmAddress, openTransport, signTransactionData } from '../utils'

export interface ILedgerProcessMessage {
    error?: string | Error | unknown
    data: ILedgerProcessMessageData
}

export interface ILedgerProcessMessageData {
    method: LedgerMethod
    parameters: (string | unknown)[]
}

export enum LedgerMethod {
    GenerateEvmAddress = 'generate-evm-address',
    SignEvmTransaction = ' sign-evm-transaction',
}

process.parentPort.on('message', void messageHandler)

async function messageHandler(message: ILedgerProcessMessage): Promise<void> {
    try {
        await openTransport()

        let data
        const { parameters } = message.data
        switch (message.data.method) {
            case LedgerMethod.GenerateEvmAddress: {
                data = await getEvmAddress(parameters[0] as string)
                break
            }
            case LedgerMethod.SignEvmTransaction: {
                data = await signTransactionData(parameters[0], parameters[1] as string)
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
