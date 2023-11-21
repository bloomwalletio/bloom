import { IAccountState } from '@core/account'
import { updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { EvmChainId } from '@core/network/enums'
import { isActiveLedgerProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'
import { closePopup } from '../../../../../../../desktop/lib/auxiliary/popup'
import { signEvmTransaction } from '../signEvmTransaction'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    chainId: EvmChainId,
    coinType: number,
    provider: Web3,
    account: IAccountState
): Promise<TransactionReceipt | undefined> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const transactionCopy = { ...transaction }

        const signedTransaction = await signEvmTransaction(transactionCopy, chainId, account, coinType)
        if (signedTransaction) {
            return await provider?.eth.sendSignedTransaction(signedTransaction)
        }
    } catch (err) {
        if (get(isActiveLedgerProfile)) {
            closePopup(true)
        }
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
