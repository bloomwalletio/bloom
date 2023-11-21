import { IAccountState } from '@core/account'
import { EvmTransactionData } from '@core/layer-2'
import { Ledger } from '@core/ledger'
import { EvmChainId } from '@core/network'
import { isSoftwareProfile, isActiveLedgerProfile } from '@core/profile/stores'
import { signEvmTransactionWithStronghold } from '@core/stronghold'
import { CoinType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'

export async function signEvmTransaction(
    transaction: EvmTransactionData,
    chainId: EvmChainId,
    account: IAccountState,
    coinType = CoinType.Ether
): Promise<string | undefined> {
    const bip44Path = {
        coinType,
        account: 0,
        change: 0,
        addressIndex: 0,
    }
    const { index } = account

    if (get(isSoftwareProfile)) {
        // Follow MetaMask's convention around incrementing address indices instead of account indices
        bip44Path.addressIndex = index
        return await signEvmTransactionWithStronghold(transaction, chainId, bip44Path)
    } else if (get(isActiveLedgerProfile)) {
        bip44Path.account = index
        delete transaction?.estimatedGas

        return (await Ledger.signEvmTransaction(transaction, chainId, bip44Path)) as string
    }
}
