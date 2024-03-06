import { IAccountState } from '@core/account/interfaces'
import { IChain } from '@core/network'
import { PersistedTransaction } from '@core/transactions'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromBlockscoutTransaction } from './generateEvmActivityFromBlockscoutTransaction'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'

export async function generateActivityFromPersistedTransaction(
    persistedTransaction: PersistedTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    const { local, blockscout, tokenTransfer } = persistedTransaction

    if (tokenTransfer) {
        return
    } else if (blockscout) {
        return await generateEvmActivityFromBlockscoutTransaction(blockscout, chain, account)
    } else if (local) {
        return await generateEvmActivityFromLocalEvmTransaction(local, chain, account)
    }

    // const transferInfo = getTransferInfoFromTransactionData(transaction, chain)
    // if (transferInfo?.type === StardustActivityType.SmartContract) {
    //     return generateSmartContractActivity(transaction, chain, account)
    // } else if (transferInfo?.type === StardustActivityType.Basic) {
    //     const { tokenId, rawAmount, additionalBaseTokenAmount, recipientAddress } = transferInfo
    //     return generateTokenActivity(
    //         transaction,
    //         chain,
    //         tokenId,
    //         rawAmount,
    //         additionalBaseTokenAmount,
    //         recipientAddress,
    //         account
    //     )
    // } else if (transferInfo?.type === StardustActivityType.Nft) {
    //     const { nftId, additionalBaseTokenAmount, recipientAddress } = transferInfo
    //     return generateNftActivity(transaction, chain, nftId, additionalBaseTokenAmount, recipientAddress, account)
    // }
}
