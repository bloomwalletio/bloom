import { IAccountState } from '@core/account'
import { updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { signEvmTransactionWithStronghold } from '@core/stronghold/utils'
import { Ledger } from '@core/ledger/classes'
import { EvmChainId } from '@core/network/enums'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import type { TxData } from '@ethereumjs/tx'
import { get } from 'svelte/store'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'
import { closePopup } from '../../../../../../../desktop/lib/auxiliary/popup'

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
        delete transactionCopy?.estimatedGas
        const txData: TxData = { ...transactionCopy }

        const bip44Path = {
            coinType,
            account: 0,
            change: 0,
            addressIndex: 0,
        }
        const { index } = account

        let signedTransaction: string | undefined
        if (get(isSoftwareProfile)) {
            // Follow MetaMask's convention around incrementing address indices instead of account indices
            bip44Path.addressIndex = index
            signedTransaction = await signEvmTransactionWithStronghold(transaction, bip44Path, chainId)
        } else if (get(isActiveLedgerProfile)) {
            bip44Path.account = index
            signedTransaction = (await Ledger.signEvmTransaction(txData, chainId, bip44Path)) as string
        }

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
