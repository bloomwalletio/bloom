import { buildBip32Path, updateSelectedAccount } from '@core/account'
import { EvmTransactionData, signTransactionWithLedger } from '@core/layer-2'
import { handleError } from '@core/error/handlers'
import Web3 from 'web3'
import { LedgerAppName } from '@core/ledger'
import { checkActiveProfileAuth } from '@core/profile/actions'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    provider: Web3,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    await checkActiveProfileAuth(
        async () => {
            try {
                updateSelectedAccount({ isTransferring: true })

                const bip32 = buildBip32Path(60, accountIndex)
                const signedTransaction = await signTransactionWithLedger(transaction, bip32)

                if (signedTransaction) {
                    await provider?.eth.sendSignedTransaction(signedTransaction)
                    callback()
                } else {
                    throw Error('No Signature provided')
                }
            } catch (err) {
                handleError(err)
            } finally {
                updateSelectedAccount({ isTransferring: false })
            }
        },
        { stronghold: true, ledger: true },
        LedgerAppName.Ethereum
    )
}
