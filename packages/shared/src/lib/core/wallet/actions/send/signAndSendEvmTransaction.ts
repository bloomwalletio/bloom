import { IAccountState } from '@core/account'
import { updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { signEvmTransactionWithStronghold } from '@core/layer-2/utils'
import { Ledger } from '@core/ledger/classes'
import { NetworkId } from '@core/network/types'
import { ETHEREUM_COIN_TYPE } from '@core/network/constants'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'
import { closePopup } from '../../../../../../../desktop/lib/auxiliary/popup'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    networkId: NetworkId,
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
            signedTransaction = await signEvmTransactionWithStronghold(transaction, bip44Path, networkId, account)
        } else if (get(isActiveLedgerProfile)) {
            signedTransaction = await Ledger.signEvmTransaction(transaction, networkId, bip44Path)
        }

        if (signedTransaction) {
            return await provider?.eth.sendSignedTransaction(signedTransaction)
        } else {
            if (get(isActiveLedgerProfile)) {
                closePopup(true)
            }
            throw new Error('No signature provided')
        }
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
