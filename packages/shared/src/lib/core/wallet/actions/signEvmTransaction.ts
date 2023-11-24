import { IAccountState } from '@core/account'
import { EvmTransactionData } from '@core/layer-2'
import { Ledger } from '@core/ledger'
import { IChain } from '@core/network'
import { isSoftwareProfile, isActiveLedgerProfile } from '@core/profile/stores'
import { signEvmTransactionWithStronghold } from '@core/stronghold'
import { get } from 'svelte/store'

export async function signEvmTransaction(
    transaction: EvmTransactionData,
    chain: IChain,
    account: IAccountState
): Promise<string | undefined> {
    const { chainId, coinType } = chain.getConfiguration() ?? {}
    const bip44Path = {
        coinType,
        account: 0,
        change: 0,
        addressIndex: 0,
    }
    const { index } = account

    const transactionCopy = structuredClone(transaction)
    if (get(isSoftwareProfile)) {
        // Follow MetaMask's convention around incrementing address indices instead of account indices
        bip44Path.addressIndex = index
        return await signEvmTransactionWithStronghold(transactionCopy, chainId, bip44Path)
    } else if (get(isActiveLedgerProfile)) {
        bip44Path.account = index
        delete transactionCopy?.estimatedGas

        return (await Ledger.signEvmTransaction(transactionCopy, chainId, bip44Path)) as string
    }
}
