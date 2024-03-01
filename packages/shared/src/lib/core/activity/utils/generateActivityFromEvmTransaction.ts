import { StardustActivity, PersistedEvmTransaction } from '../types'
import { IChain } from '@core/network'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { generateSmartContractActivity } from './evm/generateSmartContractActivity'
import { generateTokenActivity } from './evm/generateTokenActivity'
import { generateNftActivity } from './evm/generateNftActivity'
import { IAccountState } from '@core/account/interfaces'
import { StardustActivityType } from '../enums'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<StardustActivity | undefined> {
    const transferInfo = getTransferInfoFromTransactionData(transaction, chain)

    if (transferInfo?.type === StardustActivityType.SmartContract) {
        return generateSmartContractActivity(transaction, chain, account)
    } else if (transferInfo?.type === StardustActivityType.Basic) {
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
    } else if (transferInfo?.type === StardustActivityType.Nft) {
        const { nftId, additionalBaseTokenAmount, recipientAddress } = transferInfo
        return generateNftActivity(transaction, chain, nftId, additionalBaseTokenAmount, recipientAddress, account)
    }
}
