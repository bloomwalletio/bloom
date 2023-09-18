/**
 * The utility process for ledger runs in a Node.js environment,
 * meaning it has the ability to require modules and use all of Node.js APIs.
 * This approach doesn't block the main process when interacting with the ledger device.
 *
 * https://www.electronjs.org/docs/latest/tutorial/process-model#the-utility-process
 */

import { LedgerApiMethod } from '@core/ledger/enums'
import {
    closeTransport,
    getEthereumAppSettings,
    getEvmAddress,
    openTransport,
    signTransactionData,
} from '../utils/ledger.utils'
import type { ILedgerProcessMessage } from '../interfaces/ledger-process-message.interface'

/**
 * CAUTION: `process` is initialized using `utilityProcess.fork()`.
 * Do NOT export anything from this file, since `process` may be undefined.
 */
process.parentPort.on('message', (msg) => {
    void messageHandler(msg.data)
})

async function messageHandler(message: ILedgerProcessMessage): Promise<void> {
    try {
        await openTransport()

        let data
        const { method, payload } = message
        switch (method) {
            case LedgerApiMethod.GenerateEvmAddress: {
                data = await getEvmAddress(payload[0] as string)
                break
            }
            case LedgerApiMethod.GetEthereumAppSettings: {
                data = await getEthereumAppSettings()
                break
            }
            case LedgerApiMethod.SignEvmTransaction: {
                data = await signTransactionData(payload[0] as string, payload[1] as string)
                break
            }
            default:
                break
        }

        process.parentPort.postMessage({ method, payload: data })
    } catch (error) {
        process.parentPort.postMessage({ error })
    } finally {
        await closeTransport()
    }
}
