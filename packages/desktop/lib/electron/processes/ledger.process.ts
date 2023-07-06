/**
 * The utility process for ledger runs in a Node.js environment,
 * meaning it has the ability to require modules and use all of Node.js APIs.
 * This approach doesn't block the main process when interacting with the ledger device.
 *
 * https://www.electronjs.org/docs/latest/tutorial/process-model#the-utility-process
 */

import type { TxData } from '@ethereumjs/tx'

import { LedgerMethod } from '../enums/ledger-method.enum'
import type { ILedgerProcessMessage } from '../interfaces/ledger-process-message.interface'
import { closeTransport, getEvmAddress, openTransport, signTransactionData } from '../utils/ledger.utils'

/**
 * CAUTION: `process` is initialized using `utilityProcess.fork()`.
 * Do NOT export anything from this file, since `process` may be undefined.
 */
process.parentPort.on('message', messageHandler)

async function messageHandler(message: ILedgerProcessMessage): Promise<void> {
    try {
        await openTransport()

        let data
        const { method, parameters } = message.data
        switch (method) {
            case LedgerMethod.GenerateEvmAddress: {
                data = await getEvmAddress(parameters[0] as string)
                break
            }
            case LedgerMethod.SignEvmTransaction: {
                data = await signTransactionData(parameters[0] as TxData, parameters[1] as string)
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
