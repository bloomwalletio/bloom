import Web3 from 'web3'

import { updateSelectedAccount } from '@core/account/stores'
import { buildBip32Path } from '@core/account/utils'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { get } from 'svelte/store'
import { ledger } from '@core/ledger'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    provider: Web3,
    accountIndex: number
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const bip32 = buildBip32Path(60, accountIndex)
        const signedTransaction = await get(ledger).signEvmTransaction(transaction, bip32)

        if (signedTransaction) {
            await provider?.eth.sendSignedTransaction(signedTransaction)
        } else {
            throw new Error('No signature provided')
        }
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
