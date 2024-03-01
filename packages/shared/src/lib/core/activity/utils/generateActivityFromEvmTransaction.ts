import { StardustActivity, PersistedEvmTransaction } from '../types'
import { IChain } from '@core/network'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { generateSmartContractActivity } from './evm/generateSmartContractActivity'
import { generateTokenActivity } from './evm/generateTokenActivity'
import { generateNftActivity } from './evm/generateNftActivity'
import { IAccountState } from '@core/account/interfaces'
import { ActivityType } from '../enums'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<StardustActivity | undefined> {
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
