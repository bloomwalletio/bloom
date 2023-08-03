import Web3 from 'web3'

import { updateSelectedAccount } from '@core/account/stores'
import { buildBip32Path } from '@core/account/utils'
import { handleError } from '@core/error/handlers'
import { EvmTransactionData } from '@core/layer-2/types'
import { Ledger } from '@core/ledger/classes'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IAccountState } from '@core/account'
import { signEvmTransactionWithStronghold } from './signEvmTransactionWithStronghold'
import { ETHEREUM_COIN_TYPE } from '@core/layer-2/constants'

export async function signAndSendEvmTransaction(
    transaction: EvmTransactionData,
    chainId: number,
    provider: Web3,
    account: IAccountState
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })

        let signedTransaction: string | undefined
        if (get(isSoftwareProfile)) {
            signedTransaction = await signEvmTransactionWithStronghold(transaction, chainId, account)
        } else if (get(isActiveLedgerProfile)) {
            const bip32 = buildBip32Path(ETHEREUM_COIN_TYPE, account.index)
            signedTransaction = await Ledger.signEvmTransaction(transaction, bip32)
        }

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
