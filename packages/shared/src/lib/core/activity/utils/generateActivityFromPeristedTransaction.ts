import { IAccountState } from '@core/account/interfaces'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { IChain } from '@core/network'
import { PersistedTransaction, buildPersistedEvmTransactionFromBlockscoutTransaction } from '@core/transactions'
import { ActivityType } from '../enums'
import { StardustActivity, PersistedEvmTransaction } from '../types'
import { generateNftActivity } from './evm/generateNftActivity'
import { generateSmartContractActivity } from './evm/generateSmartContractActivity'
import { generateTokenActivity } from './evm/generateTokenActivity'

export async function generateActivityFromPersistedTransaction(
    persistedTransaction: PersistedTransaction,
    chain: IChain,
    account: IAccountState
): Promise<StardustActivity | undefined> {
    const transaction = persistedTransaction.blockscout
        ? buildPersistedEvmTransactionFromBlockscoutTransaction(persistedTransaction.blockscout)
        : (persistedTransaction.local as PersistedEvmTransaction)
    const transferInfo = getTransferInfoFromTransactionData(transaction, chain)
    if (transferInfo?.type === ActivityType.SmartContract) {
        return generateSmartContractActivity(transaction, chain, account)
    } else if (transferInfo?.type === ActivityType.Basic) {
        const { tokenId, rawAmount, additionalBaseTokenAmount, recipientAddress } = transferInfo
        return generateTokenActivity(
            transaction,
            chain,
            tokenId,
            rawAmount,
            additionalBaseTokenAmount,
            recipientAddress,
            account
        )
    } else if (transferInfo?.type === ActivityType.Nft) {
        const { nftId, additionalBaseTokenAmount, recipientAddress } = transferInfo
        return generateNftActivity(transaction, chain, nftId, additionalBaseTokenAmount, recipientAddress, account)
    }
}
