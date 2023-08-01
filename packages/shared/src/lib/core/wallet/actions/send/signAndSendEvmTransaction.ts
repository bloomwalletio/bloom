import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'

import { updateSelectedAccount } from '@core/account/stores'
import { buildBip32Path } from '@core/account/utils'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { signTransactionWithLedger } from '@core/layer-2/utils'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    provider: Web3,
    accountIndex: number
): Promise<TransactionReceipt | undefined> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const bip32 = buildBip32Path(60, accountIndex)
        const signedTransaction = await signTransactionWithLedger(transaction, bip32)

        if (signedTransaction) {
            return await provider?.eth.sendSignedTransaction(signedTransaction)
        } else {
            throw new Error('No signature provided')
        }
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
