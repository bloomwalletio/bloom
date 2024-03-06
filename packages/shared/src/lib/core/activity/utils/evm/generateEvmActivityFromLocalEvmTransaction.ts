import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { EvmActivity, EvmCoinTransferActivity, EvmTokenTransferActivity } from '@core/activity/types'
import { IChain } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { BASE_TOKEN_ID } from '@core/token'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { StardustActivityType } from '@core/activity/enums'

export async function generateEvmActivityFromLocalEvmTransaction(
    transaction: LocalEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (transaction.data) {
        const transferInfo = getTransferInfoFromTransactionData(transaction, chain)
        if (transferInfo?.type === StardustActivityType.Nft) {
            const { nftId, recipientAddress } = transferInfo

            const baseActivity = await generateBaseEvmActivity(transaction, chain, recipientAddress, account)

            return {
                ...baseActivity,
                type: EvmActivityType.TokenTransfer,
                tokenTransfer: {
                    tokenId: nftId,
                    rawAmount: BigInt(1),
                },
            } as EvmTokenTransferActivity
        }
    } else {
        // i.e must be a coin transfer
        const baseActivity = await generateBaseEvmActivity(transaction, chain, transaction.to, account)

        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount: transaction.value,
            },
        } as EvmCoinTransferActivity
    }

    return Promise.resolve(undefined)
}
