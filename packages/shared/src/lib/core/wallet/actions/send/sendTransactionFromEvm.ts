import { getSelectedAccount } from '@core/account'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'

export async function sendTransactionFromEvm(
    transaction: EvmTransactionData,
    chain: IChain,
    callback: () => void
): Promise<void> {
    const account = getSelectedAccount()
    const provider = chain.getProvider()

    await checkActiveProfileAuth(
        async () => {
            await signAndSendEvmTransaction(transaction, provider, account.index)
            callback()
        },
        { stronghold: true, ledger: true },
        LedgerAppName.Ethereum
    )
}
