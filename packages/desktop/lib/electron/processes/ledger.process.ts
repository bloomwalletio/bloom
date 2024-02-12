/**
 * The utility process for ledger runs in a Node.js environment,
 * meaning it has the ability to require modules and use all of Node.js APIs.
 * This approach doesn't block the main process when interacting with the ledger device.
 *
 * https://www.electronjs.org/docs/latest/tutorial/process-model#the-utility-process
 */

import { LedgerApiMethod } from '@core/ledger/enums'
import type { ILedgerProcessMessage } from '../interfaces/ledger-process-message.interface'
import {
    closeTransport,
    getEthereumAppSettings,
    getEvmAddress,
    openTransport,
    signEIP712Message,
    signMessage,
    signTransactionData,
} from '../utils/ledger.utils'
import type { LedgerApiRequestResponse } from '@core/ledger'

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

        let data: LedgerApiRequestResponse
        const { method, payload } = message
        switch (method) {
            case LedgerApiMethod.GenerateEvmAddress: {
                data = await getEvmAddress(payload[0])
                break
            }
            case LedgerApiMethod.GetEthereumAppSettings: {
                data = await getEthereumAppSettings()
                break
            }
            case LedgerApiMethod.SignEvmTransaction: {
                data = await signTransactionData(payload[0], payload[1])
                break
            }
            case LedgerApiMethod.SignMessage: {
                data = await signMessage(payload[0], payload[1])
                break
            }
            case LedgerApiMethod.SignEIP712: {
                data = await signEIP712Message(payload[0], payload[1], payload[2])
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
