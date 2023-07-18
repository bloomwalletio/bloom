import { buildBip32Path, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData, signTransactionWithLedger } from '@core/layer-2'
import Web3 from 'web3'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    provider: Web3,
    accountIndex: number
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const bip32 = buildBip32Path(60, accountIndex)
        const signedTransaction = await signTransactionWithLedger(transaction, bip32)

        if (signedTransaction) {
            await provider?.eth.sendSignedTransaction(signedTransaction)
        } else {
            throw Error('No Signature provided')
        }
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
