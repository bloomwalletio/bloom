import { IAccountState } from '@core/account'
import { EvmTransactionData } from '@core/layer-2'
import { Ledger } from '@core/ledger'
import { IEvmNetwork } from '@core/network'
import { isSoftwareProfile, isActiveLedgerProfile } from '@core/profile/stores'
import { signEvmTransactionWithStronghold } from '@core/stronghold'
import { get } from 'svelte/store'

export async function signEvmTransaction(
    transaction: EvmTransactionData,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<string> {
    const bip44Path = {
        coinType: evmNetwork.coinType,
        account: 0,
        change: 0,
        addressIndex: 0,
    }
    const { index } = account

    const transactionCopy = structuredClone(transaction)
    let signature: string | undefined
    if (get(isSoftwareProfile)) {
        // Follow MetaMask's convention around incrementing address indices instead of account indices
        bip44Path.addressIndex = index
        signature = await signEvmTransactionWithStronghold(transactionCopy, evmNetwork.chainId, bip44Path)
    } else if (get(isActiveLedgerProfile)) {
        bip44Path.account = index
        delete transactionCopy?.estimatedGas

        signature = (await Ledger.signEvmTransaction(transactionCopy, evmNetwork, bip44Path)) as string
    }

    if (!signature) {
        throw new Error('Failed to sign EVM transaction')
    }
    return signature
}
