import { IAccountState } from '@core/account/interfaces'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { IChain } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { StardustActivityType } from '../../enums'
import { StardustActivity } from '../../types'
import { generateNftActivity } from './generateNftActivity'
import { generateSmartContractActivity } from './generateSmartContractActivity'
import { generateTokenActivity } from './generateTokenActivity'

export async function generateActivityFromEvmTransaction(
    transaction: LocalEvmTransaction,
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
