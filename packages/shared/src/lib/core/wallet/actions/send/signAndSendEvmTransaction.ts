import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'

import { updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { Ledger } from '@core/ledger/classes'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IAccountState } from '@core/account'
import { signEvmTransactionWithStronghold } from '../../../layer-2/utils/signEvmTransactionWithStronghold'
import { ETHEREUM_COIN_TYPE } from '@core/network/constants'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    chainId: number,
    provider: Web3,
    account: IAccountState
): Promise<TransactionReceipt | undefined> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const bip44Path = {
            coinType: ETHEREUM_COIN_TYPE,
            account: account.index,
            change: 0,
            addressIndex: 0,
        }
        let signedTransaction: string | undefined
        if (get(isSoftwareProfile)) {
            signedTransaction = await signEvmTransactionWithStronghold(transaction, bip44Path, chainId, account)
        } else if (get(isActiveLedgerProfile)) {
            signedTransaction = await Ledger.signEvmTransaction(transaction, bip44Path)
        }

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
